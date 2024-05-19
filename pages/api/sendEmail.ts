import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import validator from 'validator';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FormFields {
  link1: string;
  fromEmail: string;
  password: string;
  smtpServer: string;
  smtpPort: string;
  subject: string;
  body: string;
}

interface File {
  path: string;
  name: string;
  type: string;
  size: number;
  lastModifiedDate: Date;
}

interface Files {
  emailListFile: File;
  imageFolder: File;
}

const parseForm = async (req: NextApiRequest): Promise<{ fields: FormFields; files: Files }> => {
  const form = new formidable.IncomingForm({ multiples: true, uploadDir: './uploads', keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields: fields as unknown as FormFields, files: files as unknown as Files });
    });
  });
};

const sendEmailWithImageAndLinks = async (
  toEmail: string,
  emailList: string[],
  imageFolder: string,
  link1: string,
  fromEmail: string,
  password: string,
  smtpServer: string,
  smtpPort: number,
  subject: string,
  body: string
) => {
  const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: false,
    auth: {
      user: fromEmail,
      pass: password,
    },
  });

  const htmlBody = body.replace('{link1}', link1);

  const msg = {
    from: fromEmail,
    to: toEmail,
    subject,
    html: htmlBody,
    attachments: [{}],
  };

  const index = emailList.indexOf(toEmail);
  const imageFilename = `${index + 1}.jpg`;
  const imageFilePath = path.join(imageFolder, imageFilename);

  if (!fs.existsSync(imageFilePath)) {
    throw new Error(`Image file not found for ${toEmail}`);
  }

  const imgData = fs.readFileSync(imageFilePath);

  msg.attachments.push({
    filename: imageFilename,
    content: imgData,
  });

  await transporter.sendMail(msg);
  console.log(`Email sent to: ${toEmail} with image and link: ${link1}`);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    const emailListFilePath = files.emailListFile.path;
    const imageFolderPath = files.imageFolder.path;
    const link1 = fields.link1 as string;
    const fromEmail = fields.fromEmail as string;
    const password = fields.password as string;
    const smtpServer = fields.smtpServer as string;
    const smtpPort = parseInt(fields.smtpPort as string, 10);

    // Validate form fields
    if (!validator.isEmail(fromEmail)) {
      return res.status(400).json({ error: 'Invalid from email address' });
    }

    if (
      !emailListFilePath ||
      !imageFolderPath ||
      !link1 ||
      !fromEmail ||
      !password ||
      !smtpServer ||
      !smtpPort
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailList = fs.readFileSync(emailListFilePath, 'utf-8').split('\n');

    for (const toEmail of emailList) {
      await sendEmailWithImageAndLinks(
        toEmail.trim(),
        emailList,
        imageFolderPath,
        link1,
        fromEmail,
        password,
        smtpServer,
        smtpPort,
        fields.subject as string,
        fields.body as string
      );
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
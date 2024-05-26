import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import formidable, { IncomingForm } from 'formidable';
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
}

interface Files {
  emailListFile: File;
  imageFolder: File;
}

const parseForm = async (req: NextApiRequest): Promise<{ fields: FormFields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir: './uploads', allowEmptyFiles: true });
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        fields: {
          link1: fields.link1 ? fields.link1[0] : '',
          fromEmail: fields.fromEmail ? fields.fromEmail[0] : '',
          password: fields.password ? fields.password[0] : '',
          smtpServer: fields.smtpServer ? fields.smtpServer[0] : '',
          smtpPort: fields.smtpPort ? fields.smtpPort[0] : '',
          subject: fields.subject ? fields.subject[0] : '',
          body: fields.body ? fields.body[0] : '',
        },
        files: {
          emailListFile: {
            path: files.emailListFile ? files.emailListFile[0].filepath : '',
          },
          imageFolder: {
            path: files.imageFolder ? files.imageFolder[0].filepath : '',
          },
        },
      });
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

  let imgData = null;
  if (fs.existsSync(imageFilePath)) {
    imgData = fs.readFileSync(imageFilePath);
  } else {
    console.error(`Image file not found for ${toEmail} at path: ${imageFilePath}`);
  }

  if (imgData) {
    msg.attachments.push({
      filename: imageFilename,
      content: imgData,
    });
  }

  await transporter.sendMail(msg);
  console.log(`Email sent to: ${toEmail} with image and link: ${link1}`);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { fields, files } = await parseForm(req);

    const emailListFilePath = files.emailListFile.path;
    const imageFolderPath = files.imageFolder.path;
    const link1 = fields.link1;
    const fromEmail = fields.fromEmail;
    const password = fields.password;
    const smtpServer = fields.smtpServer;
    const smtpPort = parseInt(fields.smtpPort, 10);

    if (!validator.isEmail(fromEmail)) {
      res.status(400).json({ error: 'Invalid from email address' });
      return;
    }

    if (!emailListFilePath || !imageFolderPath || !link1 || !fromEmail || !password || !smtpServer || !smtpPort) {
      res.status(400).json({ error: 'All fields are required' });
      return;
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
        fields.subject,
        fields.body
      );
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
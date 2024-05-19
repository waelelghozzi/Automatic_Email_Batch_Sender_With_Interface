"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [showFileUpload, setShowFileUpload] = useState(true);

  const toggleView = () => {
    setShowFileUpload((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">MailFlow</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome to MailFlow!<br/>
          MailFlow streamlines sending large batches of emails with personalized attachments. Effortlessly attach specific images or documents to each recipient and experience efficient, easy file sending with just a few clicks.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Upload File</h2>
            <Button size="sm" variant="outline">
              <FolderIcon className="h-4 w-4" />
              Browse
            </Button>
          </div>
          <Input className="w-full" type="file" />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Email Recipients</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={toggleView}>
                {showFileUpload ? (
                  <FileIcon className="h-4 w-4" />
                ) : (
                  <EmailIcon className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline">
                <PlusIcon className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
          {showFileUpload ? (
            <div className="grid gap-2">
              <Input placeholder="Enter email address" type="email" />
            </div>
          ) : (
            <div className="grid gap-2">
              <Input className="w-full" type="file" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Status</h2>
          <Button variant="default">
            <SendIcon className="h-4 w-4" />
            Send
          </Button>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-4 w-4" />
            Uploading file...
          </div>
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckIcon className="h-4 w-4" />
            Email sent successfully
          </div>
          <div className="flex items-center gap-2 text-sm text-red-500">
            <XIcon className="h-4 w-4" />
            Failed to send email
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FolderIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function PlusIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SendIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function FileIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function EmailIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7" />
      <path d="M22 6v0a2 2 0 0 0-2-2H4C2.9 4 2 4.9 2 6v0" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

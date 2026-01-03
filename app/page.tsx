"use client";

import { useEffect, useState } from "react";
import { formatEmailDate, formatFullDate } from "@/lib/date-utils";

type Email = {
  id: string;
  from: string;
  address: string;
  time: string;
  message: string;
  subject: string;
  tag: string;
  read: string;
};

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/barbinbrad/13609dd592e31d8307dec955889e174d/raw/d9a29d9ff4053e5539e57bdd9e75c9fe527a0096/inbox.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setSelectedEmail(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-3">
      <div className="overflow-y-auto border-r border-neutral-800 md:col-span-1">
        <div className="border-b border-neutral-800 p-4">
          <h1 className="text-2xl font-semibold text-neutral-50">Inbox</h1>
        </div>
        <div>
          {emails.map((email) => (
            <button
              key={email.id}
              type="button"
              onClick={() => setSelectedEmail(email)}
              className={`w-full border-b border-neutral-800 p-4 text-left transition-colors hover:bg-neutral-800 ${
                email.read === "true" ? "bg-neutral-950" : "bg-neutral-900"
              }`}
            >
              <div
                className={`mb-1 text-neutral-50 ${
                  email.read === "false" ? "font-semibold" : ""
                }`}
              >
                {email.subject}
              </div>
              <div className="mb-1 text-sm text-neutral-400">{email.from}</div>
              <div className="text-xs text-neutral-600">
                {formatEmailDate(email.time)}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto border-t border-neutral-800 md:col-span-2 md:border-t-0">
        {selectedEmail ? (
          <div>
            <div className="border-b border-neutral-800 p-6">
              <h2 className="mb-4 text-3xl font-semibold text-neutral-50">
                {selectedEmail.subject}
              </h2>
              <div className="mb-2 text-sm text-neutral-400">
                <strong className="text-neutral-300">From:</strong>{" "}
                {selectedEmail.from} ({selectedEmail.address})
              </div>
              <div className="text-sm text-neutral-400">
                <strong className="text-neutral-300">Date:</strong>{" "}
                {formatFullDate(selectedEmail.time)}
              </div>
            </div>
            <div className="p-6 leading-relaxed text-neutral-300">
              {selectedEmail.message}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600">
            Select an email to view
          </div>
        )}
      </div>
    </div>
  );
}

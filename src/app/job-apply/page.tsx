'use client';

import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useGetCoverLetterQuery } from '../store/cover-letter/cover-letter.api';
import { toast } from 'sonner';
import { ImSpinner } from 'react-icons/im';

const tabs = ['frontend', 'backend', 'fullstack'];

const tabTitles: Record<string, string> = {
  frontend: 'Sr. Front-end',
  backend: 'Sr. Back-end',
  fullstack: 'Sr. Full Stack',
};

const cvUrls: Record<string, string> = {
  frontend: 'https://drive.google.com/file/d/1RV1u8EX74Z-asYbgWHKvY1eh8pXcK8du/view?usp=drive_link',
  backend:
    'https://drive.google.com/file/d/1RV1u8EX74Z-asYbgWHKvY1eh88373pXcK8du/view?usp=drive_link',
  fullstack:
    'https://drive.google.com/file/d/1wMVa6CGvLa_kThUeM5wrX4LbEya8t1_r/view?usp=drive_link',
};

export default function ApplyJob() {
  const [selectedTab, setSelectedTab] = useState('frontend');
  const [companyEmail, setCompanyEmail] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useGetCoverLetterQuery(selectedTab);

  useEffect(() => {
    if (data?.text) {
      setCoverLetterText(data.text);
    }
  }, [data]);

  const handleSend = async () => {
    if (!companyEmail) return toast.error('Please enter company email');

    try {
      setLoading(true);
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: companyEmail.trim(),
          cover_letter: coverLetterText,
          job_title: tabTitles[selectedTab],
          cv_url: cvUrls[selectedTab],
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      toast.success('Application sent successfully!');
      setCompanyEmail('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow rounded mt-10">
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded font-medium cursor-pointer ${
              selectedTab === tab ? 'bg-cyan-400 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <input
        type="email"
        placeholder="Company email"
        className="w-full p-2 border rounded text-gray-500"
        value={companyEmail}
        onChange={(e) => setCompanyEmail(e.target.value)}
      />
      <div>
        {isLoading ? (
          <p>Loading cover letter...</p>
        ) : (
          <textarea
            className="w-full p-2 border rounded text-black"
            rows={10}
            value={coverLetterText}
            onChange={(e) => setCoverLetterText(e.target.value)}
          />
        )}
      </div>
      <button
        onClick={handleSend}
        disabled={loading}
        className="
    bg-cyan-400 text-white px-4 py-2 rounded-lg font-medium
    shadow-md hover:bg-cyan-300 active:scale-95 transition-all
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer flex items-center justify-center
  "
      >
        {loading ? <ImSpinner className="animate-spin h-5 w-5" /> : 'Apply'}
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  useGetCoverLetterQuery,
  useUpdateCoverLetterMutation,
} from '../store/cover-letter/cover-letter.api';
import { FaRegCopy } from 'react-icons/fa';
import { ImSpinner } from 'react-icons/im';
import { toast } from 'sonner';

export default function BackendPage() {
  const type = 'backend';

  const { data, isLoading, isError } = useGetCoverLetterQuery(type);

  const [updateCoverLetter, { isLoading: isUpdating }] = useUpdateCoverLetterMutation();

  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.text) {
      setText(data.text);
    } else if (!data) {
      setText(
        `Dear Hiring Manager,\n\nI am excited to apply for the Back-end Developer position...`,
      );
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateCoverLetter({ type, text }).unwrap();
      setIsEditing(false);
      toast.success('Cover letter saved!');
    } catch (err) {
      console.error(err);
      toast.error('Error saving cover letter');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-800 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (isError) return <p>Error loading cover letter</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Back-end Cover Letter</h1>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                     bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95
                     transition cursor-pointer shadow-sm"
        >
          <FaRegCopy className="text-lg" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {isEditing ? (
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded mb-4 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p className="whitespace-pre-wrap mb-4">{text}</p>
      )}

      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        disabled={isUpdating}
        className="
          bg-yellow-400 text-white px-4 py-2 rounded-lg font-medium
          shadow-md hover:bg-yellow-300 active:scale-95 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer flex items-center justify-center gap-2
        "
      >
        {isEditing ? isUpdating ? <ImSpinner className="animate-spin h-5 w-5" /> : 'Save' : 'Edit'}
      </button>
    </div>
  );
}

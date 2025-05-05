import React, { useRef } from 'react';

const CredentialsCard = ({ fileName, onFileChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Credentials</h3>
      <div className="flex items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
        <div className="flex-shrink-0">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <label className="block font-medium text-gray-700 mb-1">
            Upload Your Credentials
          </label>
          <p className="text-sm text-gray-500 mb-3">
            PDF, DOC, or DOCX up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
          >
            Select File
          </button>
          {fileName && (
            <p className="mt-2 text-sm text-green-600">Selected: {fileName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialsCard;
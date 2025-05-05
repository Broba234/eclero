import React, { useRef } from 'react';
import Image from 'next/image';

const ProfilePictureCard = ({ imageUrl, onImageChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative w-40 h-40 mx-auto cursor-pointer group"
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center border-2 border-dashed ${
            imageUrl ? 'border-transparent' : 'border-gray-300 hover:border-gray-400'
          } transition-colors duration-200`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Profile preview"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-500 transition-colors duration-200"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600">
                Click to upload
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-center text-gray-500 mt-4">
        PNG, JPG, GIF up to 10MB
      </p>
    </div>
  );
};

export default ProfilePictureCard;
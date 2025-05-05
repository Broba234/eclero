import React from 'react';

export default function BirthdateInput({ value, onChange }) {
  return (
    <div>
      <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
        Date de naissance
      </label>
      <input
        type="date"
        id="birthdate"
        name="birthdate"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
    </div>
  );
}
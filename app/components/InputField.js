import React from 'react';

const InputField = ({ label, id, type = 'text', value, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
    <label 
      htmlFor={id} 
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
    />
  </div>
);

export default InputField;
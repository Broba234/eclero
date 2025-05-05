import supabase from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import InputField from '@/app/components/InputField';

export default function EducationLevel({ value, onChange }) {
  const [selectedLevel, setSelectedLevel] = useState(value);

  useEffect(() => {
    setSelectedLevel(value);
  }, [value]);

  const handleSave = async (newLevel) => {
    try {
      const { error } = await supabase
        .from('profiles') // Replace 'profiles' with your actual table name
        .update({ education_level: newLevel })
        .eq('id', 'user-id'); // Replace 'user-id' with the actual user ID

      if (error) {
        console.error('Error updating education level:', error);
      } else {
        console.log('Education level updated successfully');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleChange = (e) => {
    const newLevel = e.target.value;
    setSelectedLevel(newLevel);
    onChange(e);
    handleSave(newLevel);
  };

  const options = [
    '< Grade 8',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
    'Undergraduate'
  ];

  return (
    <div className="flex flex-col">
      <label htmlFor="educationLevel" className="text-sm font-medium text-gray-700 mb-2">
        Education Level
      </label>
      <select
        id="educationLevel"
        value={selectedLevel}
        onChange={handleChange}
        className="mt-1 block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-lg text-gray-700"
      >
        <option value="" disabled>{selectedLevel || 'Select your education level'}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
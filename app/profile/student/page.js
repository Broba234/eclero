'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import ProfilePictureCard from '@/app/components/ProfilePictureCard';
import InputField from '@/app/components/InputField';
import EducationLevel from '@/app/components/EducationLevel';
import BirthdateInput from '@/app/components/BirthdateInput';
import { supabase } from '@/app/utils/supabaseClient';

export default function StudentProfilePage() {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    educationLevel: '',
    profilePicture: '',
    password: '',
    birthdate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', profileData);

    const insertObject = {
      full_name: profileData.fullName,
      email: profileData.email,
      role: "student",
      education_level: profileData.educationLevel || "",
      birthdate: profileData.birthdate || null,
      profile_picture: profileData.profilePicture || "",
    };

    console.log("Insertion de l'objet dans Supabase:", insertObject);

    const { data, error } = await supabase.from("students").insert([insertObject]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Profile
          </h1>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <ProfilePictureCard 
              imageUrl={profileData.profilePicture}
              onImageChange={handleImageChange}
            />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  label="Full Name"
                  id="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                />
                <InputField 
                  label="Email"
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                />
              </div>
              <InputField 
                label="Password"
                id="password"
                type="password"
                value={profileData.password}
                onChange={handleInputChange}
              />
              <EducationLevel 
                value={profileData.educationLevel}
                onChange={handleInputChange}
              />
              <BirthdateInput
                value={profileData.birthdate}
                onChange={(value) => setProfileData((prev) => ({ ...prev, birthdate: value }))}
              />
            </div>
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
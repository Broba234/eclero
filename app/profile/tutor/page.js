'use client';

import { useState } from 'react';
import ProfilePictureCard from '@/app/components/ProfilePictureCard';
import InputField from '@/app/components/InputField';
import EducationLevel from '@/app/components/EducationLevel';
import SubjectSelector from '@/app/components/SubjectSelector';
import BirthdateInput from '@/app/components/BirthdateInput';

export default function TutorProfilePage() {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    educationLevel: '',
    password: '',
    birthdate: '',
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTutorSignup = async (e) => {
    e.preventDefault();
    console.log('Form submitted', { profileData, selectedSubjects });

    const insertObject = {
      full_name: profileData.fullName,
      email: profileData.email,
      role: "tutor",
      education_level: profileData.educationLevel || "",
      birthdate: profileData.birthdate || null,
      subjects: selectedSubjects,
      is_available_now: false
    };

    console.log("Insertion de l'objet dans Supabase:", insertObject);

    const { data, error } = await supabase.from("tutors").insert([insertObject]);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tutor Profile</h1>
          <p className="mt-2 text-gray-600">
            Complete your profile to start teaching
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8">
          <form onSubmit={handleTutorSignup} className="space-y-8">
            <ProfilePictureCard
              imageUrl={profileData.profilePicture}
              onImageChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfileData((prev) => ({
                      ...prev,
                      profilePicture: reader.result,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
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
            <SubjectSelector
              selectedSubjects={selectedSubjects}
              onSubjectsChange={setSelectedSubjects}
            />
            <div className="pt-8 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
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
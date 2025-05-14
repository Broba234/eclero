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
    availability: {},
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailabilitySave = (availability) => {
    setProfileData((prev) => ({ ...prev, availability }));
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
      is_available_now: false,
      availability: profileData.availability,
    };

    console.log("Insertion de l'objet dans Supabase:", insertObject);

    const { data, error } = await supabase.from("tutors").insert([insertObject]);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tutor profile</h1>

      <section>
        <h2 className="text-xl mb-4 font-semibold">Profile Picture</h2>
        <ProfilePictureCard />
      </section>

      <section>
        <h2 className="text-xl mb-4 font-semibold">Personal Information</h2>
        <InputField
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleInputChange}
          className="bg-white text-black border border-gray-300 rounded"
        />
        <InputField
          label="Email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          className="bg-white text-black border border-gray-300 rounded"
        />
        <BirthdateInput
          value={profileData.birthdate}
          onChange={(date) =>
            setProfileData((prev) => ({ ...prev, birthdate: date }))
          }
          className="bg-white text-black border border-gray-300 rounded"
        />
      </section>

      <section>
        <h2 className="text-xl mb-4 font-semibold">Education</h2>
        <EducationLevel
          value={profileData.educationLevel}
          onChange={(level) =>
            setProfileData((prev) => ({ ...prev, educationLevel: level }))
          }
          className="bg-white text-black border border-gray-300 rounded"
        />
      </section>

      <section>
        <h2 className="text-xl mb-4 font-semibold">Subjects</h2>
        <SubjectSelector
          selectedSubjects={selectedSubjects}
          onChange={setSelectedSubjects}
          className="bg-white text-black border border-gray-300 rounded"
        />
      </section>

      <button
        className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
        onClick={handleTutorSignup}
      >
        Save Profile
      </button>
    </main>
  );
}
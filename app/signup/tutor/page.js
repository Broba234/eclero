'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SubjectSelector from "@/app/components/SubjectSelector";
import BirthdateInput from "@/app/components/BirthdateInput";
import { useRouter } from 'next/navigation';

export default function TutorSignup() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    educationLevel: '',
    selectedSubjects: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectsChange = (subjects) => {
    setProfileData((prev) => ({
      ...prev,
      selectedSubjects: subjects,
    }));
  };

  async function handleTutorSignup(e) {
    e.preventDefault();

    // Validation
    if (!profileData.fullName || !profileData.email) {
      alert("Veuillez remplir tous les champs obligatoires : Nom complet et Email.");
      return;
    }

    try {
      const payload = {
        full_name: profileData.fullName,
        email: profileData.email,
        role: "tutor",
        birthdate: profileData.birthdate || "",
        education_level: profileData.educationLevel || "",
        profile_pic: profileData.profilePic || "",
        credentials_url: profileData.credentialsUrl || null,
        subjects: profileData.selectedSubjects || null,
        is_available_now: false
      };

      console.log('Signup payload:', payload); // Debug log

      const { data, error } = await supabase.from("users").insert([payload]);

      if (error) {
        console.error("Erreur lors de l'insertion dans Supabase:", error);
        alert("Échec de l'inscription. Veuillez réessayer.");
      } else {
        console.log("Utilisateur inséré avec succès dans Supabase:", data);
        alert("Inscription réussie!");
        setProfileData({
          fullName: '',
          email: '',
          educationLevel: '',
          selectedSubjects: []
        });
        router.push('/dashboard/tutor');
      }
    } catch (err) {
      console.error("Erreur inattendue lors de l'inscription:", err);
      alert("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inscription Tuteur</h1>
          <p className="mt-2 text-gray-600">
            Complétez votre profil pour commencer à enseigner.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8">
          <form onSubmit={handleTutorSignup} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Nom Complet
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                  Niveau d&apos;Éducation (Optionnel)
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={profileData.educationLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Sélectionnez votre niveau d&apos;éducation</option>
                  <option value="12e_annee">12e année</option>
                  <option value="premier_cycle_universitaire">Premier cycle universitaire</option>
                  <option value="deuxieme_cycle_universitaire">Deuxième cycle universitaire (graduate)</option>
                </select>
              </div>

              <div>
                <BirthdateInput
                  value={profileData.birthdate || ""}
                  onChange={(value) =>
                    setProfileData((prev) => ({ ...prev, birthdate: value }))
                  }
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Matières que Vous Pouvez Enseigner</h3>
                <SubjectSelector
                  selectedSubjects={profileData.selectedSubjects}
                  onSubjectsChange={handleSubjectsChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
            >
              Créer un Profil
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
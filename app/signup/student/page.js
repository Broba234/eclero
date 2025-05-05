'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import BirthdateInput from "@/app/components/BirthdateInput";

export default function StudentSignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    educationLevel: '',
    birthdate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields are filled
    if (!formData.fullName || !formData.email || !formData.educationLevel) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        role: "student",
        birthdate: formData.birthdate || "",
        education_level: formData.educationLevel,
        profile_pic: "",
        credentials_url: null,
        subjects: null,
        is_available_now: false
      };

      const { data: supabaseData, error } = await supabase.from("users").insert([payload]);

      if (error) {
        console.error("Error inserting into Supabase:", error);
        setError(`Signup failed: ${error.message}`);
      } else {
        console.log("User successfully inserted into Supabase:", supabaseData);
        router.push('/dashboard/student');
      }
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Inscription Étudiant</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-6">
          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nom Complet
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de Passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
              Niveau d&apos;Éducation
            </label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionnez votre niveau d&apos;éducation</option>
              <option value="avant_secondaire">Avant le secondaire (moins de 8e année)</option>
              <option value="secondaire">Secondaire (8e à 12e année)</option>
              <option value="universite_premier_cycle">Université – Premier cycle (baccalauréat)</option>
              <option value="universite_deuxieme_cycle">Université – Deuxième cycle (maîtrise)</option>
              <option value="universite_troisieme_cycle">Université – Troisième cycle (doctorat)</option>
            </select>
          </div>

          <div className="space-y-2">
            <BirthdateInput
              value={formData.birthdate || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, birthdate: value }))
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mt-8"
          >
            Créer un Compte Étudiant
          </button>
        </form>
      </div>
    </main>
  );
}
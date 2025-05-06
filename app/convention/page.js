'use client';
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      alert("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    try {
      const { data, error } = await supabase.from("waitlist").insert([{ email }]);

      if (error) {
        console.error("Erreur lors de l'ajout à la liste d'attente :", error);
        alert("Échec de l'inscription à la liste d'attente. Veuillez réessayer plus tard.");
      } else {
        setMessage("Merci de vous être inscrit à la liste d’attente !");
        setEmail("");
      }
    } catch (err) {
      console.error("Erreur inattendue :", err);
      alert("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 flex flex-col items-center justify-center">
      <div className="flex justify-center items-center py-12">
        <Image
          src="/eclero-high-resolution-logo-transparent.png"
          alt="Éclero Logo"
          width={256}
          height={256}
          className="w-48 sm:w-64"
        />
      </div>
      <p className="text-center text-white mb-6">
        Éclero connecte instantanément les étudiants aux meilleurs tuteurs pour une aide en temps réel — rapide, simple, fiable.
      </p>
      <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Rejoignez la révolution éducative
        </h2>
        <form onSubmit={handleJoinWaitlist} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md"
          >
            Joindre
          </button>
        </form>
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
      </div>
    </main>
  );
}

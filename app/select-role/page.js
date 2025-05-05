'use client';

import { useRouter } from 'next/navigation';

export default function SelectRolePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Qui êtes-vous ?
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => router.push('/signup/student')}
          className="px-8 py-6 text-xl font-semibold bg-blue-600 text-white rounded-xl
                     hover:bg-blue-700 transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl"
        >
          Je suis un étudiant
        </button>

        <button
          onClick={() => router.push('/signup/tutor')}
          className="px-8 py-6 text-xl font-semibold bg-green-600 text-white rounded-xl
                     hover:bg-green-700 transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl"
        >
          Je suis un tuteur
        </button>
      </div>
    </main>
  );
}
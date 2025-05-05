'use client';

import { useRouter } from 'next/navigation';

export default function StudentDashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Tableau de Bord Étudiant</h1>
          <button
            onClick={() => router.push('/profile/student')}
            className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors shadow-sm"
          >
            <svg
              className="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* Trouver un Tuteur Maintenant Card */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trouver un Tuteur Maintenant</h2>
          <p className="text-gray-600 mb-4">Besoin d&apos;aide immediate ? Trouvez un tuteur disponible maintenant pour vous aider.</p>
          <button
            onClick={() => router.push('/find-tutor')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Trouver un Tuteur
          </button>
        </div>

        {/* Mock Past Tutors Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tuteurs Passés</h2>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
            <div>
              <p className="text-gray-800 font-medium">Jean Dupont</p>
              <p className="text-gray-600 text-sm">Mathématiques</p>
            </div>
          </div>
          <p className="text-gray-600">Vous avez travaillé avec Jean Dupont pour améliorer vos compétences en mathématiques.</p>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useRouter } from 'next/navigation';

export default function TutorDashboardPage() {
  const router = useRouter();
  // Placeholder earnings - in real app this would come from backend
  const earnings = 0.00;

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with Avatar */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Tableau de Bord Tuteur
          </h1>
          <button
            onClick={() => router.push('/profile/tutor')}
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* Availability Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Je suis Disponible Maintenant
          </h2>
          <button
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold
                     hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            Je suis Disponible
          </button>
        </section>

        {/* Earnings Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-8 text-gray-900">
              Revenus
            </h2>
            <div className="space-y-6">
              <div>
                <div className="text-5xl font-extrabold text-gray-900 mb-2">
                  ${earnings.toFixed(2)}
                </div>
                <p className="text-gray-500 font-medium">Revenus Totaux</p>
              </div>
              
              {earnings === 0 && (
                <p className="text-gray-500 italic">
                  Vous n'avez pas encore gagné.
                </p>
              )}
              
              <div className="mt-8">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium
                           hover:bg-blue-700 transition-colors duration-200 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Voir l&apos;Historique des Revenus
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
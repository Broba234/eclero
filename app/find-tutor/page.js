"use client";

import { useState } from 'react';

export default function FindTutorPage() {
  const subjects = {
    Mathématiques: [
      { code: 'MTH1W', name: 'Mathématiques, 9e année' },
      { code: 'MPM2D', name: 'Principes des mathématiques, 10e année' },
      { code: 'MCR3U', name: 'Fonctions, 11e année' },
      { code: 'MCV4U', name: 'Calcul et vecteurs, 12e année' },
      { code: 'MHF4U', name: 'Fonctions avancées, 12e année' },
      { code: 'MDM4U', name: 'Gestion des données, 12e année' },
    ],
    Sciences: [
      { code: 'SNC1W', name: 'Sciences, 9e année' },
      { code: 'SNC2D', name: 'Sciences, 10e année' },
      { code: 'SBI3U', name: 'Biologie, 11e année' },
      { code: 'SCH3U', name: 'Chimie, 11e année' },
      { code: 'SPH3U', name: 'Physique, 11e année' },
      { code: 'SBI4U', name: 'Biologie, 12e année' },
      { code: 'SCH4U', name: 'Chimie, 12e année' },
      { code: 'SPH4U', name: 'Physique, 12e année' },
      { code: 'SES4U', name: 'Sciences de la Terre et de l’espace, 12e année' },
    ],
    Anglais: [
      { code: 'ENL1W', name: 'Anglais, 9e année' },
      { code: 'ENG2D', name: 'Anglais, 10e année' },
      { code: 'ENG3U', name: 'Anglais, 11e année' },
      { code: 'ENG4U', name: 'Anglais, 12e année' },
      { code: 'EWC4U', name: 'L’art de l’écriture, 12e année' },
      { code: 'ETS4U', name: 'Études en littérature, 12e année' },
    ],
    Histoire: [
      { code: 'CHC2D', name: 'Histoire du Canada, 10e année' },
      { code: 'CHY4U', name: 'Histoire mondiale, 12e année' },
      { code: 'CIV4U', name: 'Civisme, 12e année' },
      { code: 'CGW4U', name: 'Enjeux mondiaux : Analyse géographique, 12e année' },
      { code: 'CLN4U', name: 'Droit canadien et international, 12e année' },
    ],
    Langues: [
      { code: 'FSF1D', name: 'Français, 9e année' },
      { code: 'FSF2D', name: 'Français, 10e année' },
      { code: 'FSF3U', name: 'Français, 11e année' },
      { code: 'FSF4U', name: 'Français, 12e année' },
      { code: 'LWSCU', name: 'Espagnol, 12e année' },
    ],
    Arts: [
      { code: 'AVI1O', name: 'Arts visuels, 9e année' },
      { code: 'AVI2O', name: 'Arts visuels, 10e année' },
      { code: 'AVI3M', name: 'Arts visuels, 11e année' },
      { code: 'AVI4M', name: 'Arts visuels, 12e année' },
      { code: 'ADA3M', name: 'Théâtre, 11e année' },
      { code: 'AMU4M', name: 'Musique, 12e année' },
    ],
    Affaires: [
      { code: 'BBI2O', name: 'Introduction aux affaires, 10e année' },
      { code: 'BMI3C', name: 'Marketing : Biens, services, événements, 11e année' },
      { code: 'BOH4M', name: 'Leadership en affaires, 12e année' },
      { code: 'BAT4M', name: 'Principes de comptabilité financière, 12e année' },
    ],
    Technologie: [
      { code: 'TEJ2O', name: 'Technologie informatique, 10e année' },
      { code: 'ICS3U', name: 'Introduction à l’informatique, 11e année' },
      { code: 'ICS4U', name: 'Informatique, 12e année' },
      { code: 'TDJ3M', name: 'Conception technologique, 11e année' },
      { code: 'TDJ4M', name: 'Conception technologique, 12e année' },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = selectedCategory
    ? subjects[selectedCategory].filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubject(null);
    setSearchTerm('');
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Avec quoi avez-vous besoin d&apos;aide ?</h1>
        <div className="flex">
          <div className="w-1/3 border-r pr-4">
            <h3 className="text-lg font-bold mb-4 text-black">Sujets</h3>
            <ul className="space-y-2">
              {Object.keys(subjects).map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 pl-4">
            <h3 className="text-lg font-bold mb-4 text-black">
              {selectedCategory || 'Sélectionnez un sujet'}
            </h3>
            {selectedCategory && (
              <>
                <input
                  type="text"
                  placeholder="Rechercher des cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredCourses.map((subject) => (
                    <button
                      key={subject.code}
                      onClick={() => setSelectedSubject(subject.name)}
                      className={`flex flex-col items-center justify-center w-40 h-24 rounded-xl border text-center px-2 py-2 shadow-sm transition ${
                        selectedSubject === subject.name
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-900 border-gray-300 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-base font-semibold">
                        {subject.name}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {selectedSubject && (
          <div className="mt-4">
            <p className="text-lg">Sujet sélectionné : <strong>{selectedSubject}</strong></p>
          </div>
        )}
        <button
          className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Trouver
        </button>
      </div>
    </main>
  );
}
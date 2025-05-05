'use client';

import { useState } from "react";

export default function SubjectSelector({ selectedSubjects, onSubjectsChange }) {
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
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCourse = (courseCode) => {
    if (selectedSubjects.includes(courseCode)) {
      onSubjectsChange(selectedSubjects.filter((code) => code !== courseCode));
    } else {
      onSubjectsChange([...selectedSubjects, courseCode]);
    }
  };

  const filteredCourses = selectedCategory
    ? subjects[selectedCategory].filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const truncateText = (text, maxLength) => {
    const truncated = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    return truncated.split(' ').length > 2 ? truncated.split(' ').slice(0, 2).join(' ') + '...' : truncated;
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/3 border-r pr-4">
          <h3 className="text-lg font-bold mb-4 text-black">Sujets</h3>
          <ul className="space-y-2">
            {Object.keys(subjects).map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category)}
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
          <input
            type="text"
            placeholder="Rechercher des cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <button
                type="button"
                key={course.code}
                onClick={() => toggleCourse(course.code)}
                className={`flex flex-col items-center justify-center w-40 h-24 rounded-xl border text-center px-2 py-2 shadow-sm transition ${
                  selectedSubjects.includes(course.code)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-blue-50'
                }`}
              >
                <span className="text-xs text-gray-500">
                  {course.name.split(', ')[1] || 'Niveau'}
                </span>
                <span className="text-base font-semibold">
                  {truncateText(course.name.split(', ')[0], 30)}
                </span>
                <span className="text-xs text-gray-400 mt-1">{course.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
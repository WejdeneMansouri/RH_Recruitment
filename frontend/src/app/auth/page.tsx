"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('recruitmentUser') : null;
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'Candidate') {
        router.push('/candidate/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recruitment Management System
          </h1>
          <p className="text-xl text-blue-100">
            Plateforme complète de gestion de recrutement
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidat */}
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Espace Candidat
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Consultez les offres d'emploi disponibles, postulez et suivez votre progression.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Voir les offres disponibles
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Postuler aux offres
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Suivre vos candidatures
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Consulter le score de correspondance
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <Link
                href="/candidate/login"
                className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/candidate/register"
                className="block w-full border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-green-50 transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Espace Admin
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Gérez les offres d'emploi, consultez les candidatures avec le filtrage IA.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  Publier les offres
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  Gérer les candidatures
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  Filtrage IA automatique
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  Rapports et analytics
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/login"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
              >
                Se connecter Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

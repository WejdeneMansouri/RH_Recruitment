"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string;
  experienceYears: number;
  createdAt: string;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/candidates');
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Candidats</h2>
            
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher par nom, email ou compétences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <li key={candidate.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                          <p className="text-sm text-gray-600">{candidate.phone}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                              Compétences: {candidate.skills}
                            </span>
                            <span className="text-sm text-gray-500">
                              Expérience: {candidate.experienceYears} ans
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/candidates/${candidate.id}`} className="text-blue-600 hover:text-blue-900">
                            Voir Profil
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {filteredCandidates.length === 0 && (
                  <li>
                    <div className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'Aucun candidat trouvé pour cette recherche.' : 'Aucun candidat enregistré.'}
                      <Link href="/dashboard/candidates/new" className="text-blue-600 block mt-2">Ajouter le premier candidat</Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
    </div>
  );
}
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export default function CandidatesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('recruitmentUser');
    router.push('/auth');
  };

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recruitmentUser') : null;
    if (stored) {
      try {
        const parsed: UserData = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-800">Recruitment Management</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">Dashboard</Link>
              <Link href="/dashboard/job-postings" className="text-gray-700 hover:text-blue-600 px-3 py-2">Offres</Link>
              <Link href="/dashboard/candidates" className="text-blue-600 font-medium px-3 py-2">Candidats</Link>
              <Link href="/dashboard/applications" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidatures</Link>
              <Link href="/dashboard/reports" className="text-gray-700 hover:text-blue-600 px-3 py-2">Rapports</Link>
              
              <div className="border-l border-gray-300 pl-4 flex items-center space-x-3">
                {user && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-medium"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Candidats</h2>
            <Link href="/dashboard/candidates/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Ajouter Candidat
            </Link>
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
                          <Link href={`/dashboard/candidates/${candidate.id}/edit`} className="text-green-600 hover:text-green-900">
                            Modifier
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
      </main>
    </div>
  );
}
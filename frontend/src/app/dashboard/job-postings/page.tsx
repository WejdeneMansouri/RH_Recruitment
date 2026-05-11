"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: string;
  createdAt: string;
}

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export default function JobPostingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/job-postings');
      const data = await response.json();
      setJobPostings(data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJobPosting = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await fetch(`http://localhost:8082/api/job-postings/${id}`, {
          method: 'DELETE',
        });
        setJobPostings(jobPostings.filter(job => job.id !== id));
      } catch (error) {
        console.error('Error deleting job posting:', error);
      }
    }
  };

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
              <Link href="/dashboard/job-postings" className="text-blue-600 font-medium px-3 py-2">Offres</Link>
              <Link href="/dashboard/candidates" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidats</Link>
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
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Offres d'Emploi</h2>
            <Link href="/dashboard/job-postings/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Nouvelle Offre
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {jobPostings.map((job) => (
                  <li key={job.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              Créé le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/job-postings/${job.id}`} className="text-blue-600 hover:text-blue-900">
                            Voir
                          </Link>
                          <Link href={`/dashboard/job-postings/${job.id}/edit`} className="text-green-600 hover:text-green-900">
                            Modifier
                          </Link>
                          <button
                            onClick={() => deleteJobPosting(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {jobPostings.length === 0 && (
                  <li>
                    <div className="px-4 py-8 text-center text-gray-500">
                      Aucune offre d'emploi trouvée. <Link href="/dashboard/job-postings/new" className="text-blue-600">Créer la première offre</Link>
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
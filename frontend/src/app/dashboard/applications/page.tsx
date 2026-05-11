"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Application {
  id: number;
  candidate: {
    id: number;
    name: string;
    email: string;
  };
  jobPosting: {
    id: number;
    title: string;
  };
  status: string;
  appliedDate: string;
  matchScore?: number;
}

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  interviewed: 'bg-purple-100 text-purple-800',
  hired: 'bg-green-100 text-green-800'
};

const statusLabels = {
  pending: 'En attente',
  in_review: 'En cours de révision',
  rejected: 'Rejeté',
  interviewed: 'Entretien programmé',
  hired: 'Embauché'
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

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
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8082/api/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        ));
      } else {
        console.error('Error updating application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const filteredApplications = filterStatus
    ? applications.filter(app => app.status === filterStatus)
    : applications;

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
              <Link href="/dashboard/candidates" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidats</Link>
              <Link href="/dashboard/applications" className="text-blue-600 font-medium px-3 py-2">Candidatures</Link>
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
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Candidatures</h2>
          </div>

          <div className="mb-6">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_review">En cours de révision</option>
              <option value="interviewed">Entretien programmé</option>
              <option value="rejected">Rejeté</option>
              <option value="hired">Embauché</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <li key={application.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{application.candidate.name}</h3>
                              <p className="text-sm text-gray-600">{application.candidate.email}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              Postule pour: <span className="font-medium">{application.jobPosting.title}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[application.status as keyof typeof statusColors]}`}>
                              {statusLabels[application.status as keyof typeof statusLabels]}
                            </span>
                            <span className="text-sm text-gray-500">
                              Candidature du {new Date(application.appliedDate).toLocaleDateString('fr-FR')}
                            </span>
                            {typeof application.matchScore === 'number' && (
                              <span className="text-sm text-blue-700">
                                Score: {Math.round(application.matchScore * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <select
                            value={application.status}
                            onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">En attente</option>
                            <option value="in_review">En révision</option>
                            <option value="interviewed">Entretien</option>
                            <option value="rejected">Rejeté</option>
                            <option value="hired">Embauché</option>
                          </select>
                          <Link href={`/dashboard/applications/${application.id}`} className="text-blue-600 hover:text-blue-900">
                            Détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {filteredApplications.length === 0 && (
                  <li>
                    <div className="px-4 py-8 text-center text-gray-500">
                      {filterStatus ? 'Aucune candidature trouvée pour ce statut.' : 'Aucune candidature trouvée.'}
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
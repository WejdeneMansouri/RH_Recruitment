"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: string;
  createdAt: string;
  deadline?: string;
}

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export default function JobPostingsPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
                          <div className="mt-2 flex flex-wrap items-center gap-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              Créé le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                            {job.deadline && (
                              <span className="text-sm text-blue-600">
                                Date limite : {new Date(job.deadline).toLocaleDateString('fr-FR')}
                              </span>
                            )}
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
  );
}
"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: string;
  createdAt: string;
  deadline?: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function JobPostingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobPosting();
  }, [id]);

  const fetchJobPosting = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/job-postings/${id}`);
      
      if (!response.ok) {
        setError('Offre d\'emploi non trouvée');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setJob(data);
    } catch (err) {
      console.error('Error fetching job posting:', err);
      setError('Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="px-4 py-6 sm:px-0"><p className="text-gray-600">Chargement...</p></div>;
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link href="/dashboard/job-postings" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          ← Retour aux offres
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <p className="text-gray-600">Offre non trouvée</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <Link href="/dashboard/job-postings" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Retour aux offres
      </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status === 'Open' ? 'Ouverte' : job.status}
                </span>
                <span className="text-gray-600 text-sm">
                  Créée le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                </span>
                {job.deadline && (
                  <span className="text-sm text-blue-600">
                    Date limite : {new Date(job.deadline).toLocaleDateString('fr-FR')} {new Date(job.deadline).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => router.push(`/dashboard/job-postings/${job.id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Modifier
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Compétences requises</h2>
              <div className="flex flex-wrap gap-2">
                {job.requirements.split(',').map((req) => (
                  <span key={req.trim()} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {req.trim()}
                  </span>
                ))}
              </div>
            </section>

            {job.createdBy && (
              <section className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Créée par</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {job.createdBy.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{job.createdBy.name}</p>
                    <p className="text-gray-600 text-sm">{job.createdBy.email}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
  );
}

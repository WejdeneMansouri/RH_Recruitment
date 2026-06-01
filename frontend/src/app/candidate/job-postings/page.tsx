"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: string;
  createdAt: string;
  deadline?: string;
  matchScore?: number;
}

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
  candidateId?: number;
}

export default function CandidateJobPostingsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recruitmentUser') : null;
    if (!stored) {
      router.push('/candidate/login');
      return;
    }
    const parsed: UserData = JSON.parse(stored);
    if (parsed.role !== 'Candidate' || !parsed.candidateId) {
      router.push('/candidate/login');
      return;
    }
    setUser(parsed);
    fetchOpenJobs(parsed.candidateId);
  }, [router]);

  const fetchOpenJobs = async (candidateId: number) => {
    try {
      const response = await fetch(`http://localhost:8082/api/candidates/${candidateId}/matches`);
      if (!response.ok) {
        const text = await response.text();
        console.error('Error fetching job postings:', response.status, text);
        setMessage('Impossible de récupérer les offres compatibles.');
        setJobs([]);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected jobs payload:', data);
        setMessage('Réponse inattendue du serveur pour les offres.');
        setJobs([]);
        return;
      }

      setJobs(data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setMessage('Erreur lors de la récupération des offres.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId: number) => {
    if (!user?.candidateId) return;

    try {
      const response = await fetch('http://localhost:8082/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate: { id: user.candidateId },
          jobPosting: { id: jobId },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setMessage(text || 'Impossible de postuler pour cette offre.');
        return;
      }

      const data = await response.json();
      setMessage(`Candidature envoyée. Score de correspondance : ${Math.round((data.matchScore || 0) * 100)}%`);
    } catch (error) {
      console.error('Erreur candidature:', error);
      setMessage('Erreur lors de l’envoi de la candidature.');
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Offres disponibles</h1>
            <p className="text-gray-600 mt-2">Postulez aux offres qui correspondent à vos compétences.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/candidate/dashboard" className="rounded-md bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
              Retour au tableau de bord
            </Link>
            <Link href="/candidate/applications" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Mes candidatures
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-blue-900">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="mt-2 text-gray-600">{job.description}</p>
                    <p className="mt-4 text-sm text-gray-500">Compétences requises : {job.requirements}</p>
                    {job.deadline && (
                      <p className="mt-2 text-sm text-gray-500">
                        Date limite de candidature : {new Date(job.deadline).toLocaleDateString('fr-FR')} {new Date(job.deadline).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                    {typeof job.matchScore === 'number' && (
                      <p className="mt-2 text-sm font-semibold text-green-700">
                        Score de correspondance estimé : {Math.round(job.matchScore * 100)}%
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => applyForJob(job.id)}
                    className="rounded-full bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                  >
                    Postuler
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-sm text-center text-gray-600">
                Aucune offre ouverte n'est disponible pour le moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
  candidateId?: number;
}

interface Application {
  id: number;
  status: string;
  appliedDate: string;
  matchScore?: number;
  jobPosting: {
    title: string;
  };
}

export default function CandidateApplicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchApplications(parsed.candidateId);
  }, [router]);

  const fetchApplications = async (candidateId: number) => {
    try {
      const response = await fetch(`http://localhost:8082/api/applications/candidate/${candidateId}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold">Mes candidatures</h1>
            <p className="text-gray-600 mt-2">Suivez l’état de vos candidatures et le score de correspondance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/candidate/dashboard" className="rounded-md bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
              Retour au tableau de bord
            </Link>
            <Link href="/candidate/job-postings" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Voir les offres
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">Offre : <span className="font-semibold text-gray-900">{application.jobPosting.title}</span></p>
                    <p className="text-sm text-gray-500">Statut : <span className="font-semibold">{application.status}</span></p>
                  </div>
                  <p className="text-sm text-gray-500">Posté le {new Date(application.appliedDate).toLocaleDateString('fr-FR')}</p>
                  {typeof application.matchScore === 'number' && (
                    <p className="text-sm text-blue-700">Score de correspondance : {Math.round(application.matchScore * 100)}%</p>
                  )}
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-sm text-center text-gray-600">
                Vous n'avez pas encore postulé à une offre.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

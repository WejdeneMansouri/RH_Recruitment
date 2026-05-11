"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
  candidateId?: number;
}

export default function CandidateDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [openJobsCount, setOpenJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('recruitmentUser');
    router.push('/candidate/login');
  };

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recruitmentUser') : null;
    
    if (!stored) {
      router.push('/candidate/login');
      return;
    }

    try {
      const parsed: UserData = JSON.parse(stored);
      if (parsed.role !== 'Candidate' || !parsed.candidateId) {
        router.push('/candidate/login');
        return;
      }
      setUser(parsed);
      // On appelle les fonctions de fetch séparées
      fetchOpenJobs();
      fetchApplications(parsed.candidateId);
    } catch (e) {
      router.push('/candidate/login');
    }
  }, [router]);

  const fetchOpenJobs = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/job-postings/open');
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      
      const data = await response.json();
      setOpenJobsCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Erreur offres:", err);
      // On ne crash pas, on laisse le compteur à 0
    }
  };

  const fetchApplications = async (candidateId: number) => {
    try {
      const response = await fetch(`http://localhost:8082/api/applications/candidate/${candidateId}`);
      
      // Si on reçoit un 403, c'est un problème de permission côté Spring/Backend
      if (response.status === 403) {
        console.warn("Accès refusé (403) : Vérifiez vos réglages CORS ou la sécurité de l'API");
        return;
      }

      if (!response.ok) throw new Error(`Erreur ${response.status}`);

      const data = await response.json();
      setApplicationsCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Erreur candidatures:", err);
    }
  };

  if (!user) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bonjour, {user.name}</h1>
            <p className="text-slate-600 mt-2">Bienvenue dans votre espace candidat.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/candidate/job-postings" 
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Voir les offres
            </Link>
            
            <button 
              onClick={handleLogout} 
              className="rounded-lg border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Message d'alerte si le backend bloque l'accès */}
        {applicationsCount === 0 && (
          <p className="mb-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            Note: Impossible de récupérer certaines données (Erreur de connexion au serveur 8082).
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-sm font-bold uppercase text-slate-500">Offres ouvertes</p>
            <p className="mt-4 text-4xl font-extrabold text-blue-600">{openJobsCount}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-sm font-bold uppercase text-slate-500">Mes candidatures</p>
            <p className="mt-4 text-4xl font-extrabold text-emerald-600">{applicationsCount}</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 shadow-lg text-white">
            <p className="text-sm font-bold uppercase opacity-70">Action</p>
            <p className="mt-4 text-lg">Consulter mon profil candidat</p>
            <Link href="/candidate/profile" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
              Gérer mon profil →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
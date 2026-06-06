"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalJobPostings: number;
  totalApplications: number;
  totalCandidates: number;
  pendingApplications: number;
  inReviewApplications: number;
  hiredApplications: number;
}

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobPostings: 0,
    totalApplications: 0,
    totalCandidates: 0,
    pendingApplications: 0,
    inReviewApplications: 0,
    hiredApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [jobPostingsRes, applicationsRes, candidatesRes] = await Promise.all([
        fetch('http://localhost:8082/api/job-postings'),
        fetch('http://localhost:8082/api/applications'),
        fetch('http://localhost:8082/api/candidates')
      ]);

      const jobPostings = await jobPostingsRes.json();
      const applications = await applicationsRes.json();
      const candidates = await candidatesRes.json();

      const pendingApplications = applications.filter((app: any) => app.status === 'pending').length;
      const inReviewApplications = applications.filter((app: any) => app.status === 'in_review').length;
      const hiredApplications = applications.filter((app: any) => app.status === 'hired').length;

      setStats({
        totalJobPostings: jobPostings.length,
        totalApplications: applications.length,
        totalCandidates: candidates.length,
        pendingApplications,
        inReviewApplications,
        hiredApplications
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tableau de Bord RH</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📋</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Offres Actives</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalJobPostings}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Candidatures</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalApplications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">En Cours</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pendingApplications + stats.inReviewApplications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Embauchés</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.hiredApplications}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Actions Rapides</h3>
                <div className="space-y-3">
                  <Link href="/dashboard/job-postings/new" className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700">
                    Créer une nouvelle offre
                  </Link>
                  <Link href="/dashboard/candidates" className="block w-full bg-green-600 text-white px-4 py-2 rounded-md text-center hover:bg-green-700">
                    Voir les candidats
                  </Link>
                  <Link href="/dashboard/applications" className="block w-full bg-yellow-600 text-white px-4 py-2 rounded-md text-center hover:bg-yellow-700">
                    Gérer les candidatures
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Activités Récentes</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600">Nouvelle candidature pour "Développeur Full Stack"</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600">Entretien programmé avec Jean Dupont</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-600">Offre "Designer UX" publiée</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
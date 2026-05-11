"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReportData {
  totalApplications: number;
  totalJobPostings: number;
  totalCandidates: number;
  applicationsByStatus: { [key: string]: number };
  applicationsByMonth: { month: string; count: number }[];
  topSkills: { skill: string; count: number }[];
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // TODO: Implement reports API endpoint
      // For now, using mock data
      setReportData({
        totalApplications: 156,
        totalJobPostings: 12,
        totalCandidates: 89,
        applicationsByStatus: {
          pending: 45,
          in_review: 38,
          interviewed: 23,
          rejected: 35,
          hired: 15
        },
        applicationsByMonth: [
          { month: 'Jan', count: 12 },
          { month: 'Fév', count: 18 },
          { month: 'Mar', count: 25 },
          { month: 'Avr', count: 22 },
          { month: 'Mai', count: 28 },
          { month: 'Jun', count: 31 }
        ],
        topSkills: [
          { skill: 'React', count: 45 },
          { skill: 'JavaScript', count: 38 },
          { skill: 'Python', count: 32 },
          { skill: 'Node.js', count: 28 },
          { skill: 'TypeScript', count: 25 }
        ]
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Chargement des rapports...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">Erreur lors du chargement des données</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-800">Recruitment Management</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">Dashboard</Link>
              <Link href="/dashboard/job-postings" className="text-gray-700 hover:text-blue-600 px-3 py-2">Offres</Link>
              <Link href="/dashboard/candidates" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidats</Link>
              <Link href="/dashboard/applications" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidatures</Link>
              <Link href="/dashboard/reports" className="text-blue-600 font-medium px-3 py-2">Rapports</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rapports et Analyses</h2>

          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📄</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Candidatures</dt>
                      <dd className="text-lg font-medium text-gray-900">{reportData.totalApplications}</dd>
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
                      <span className="text-white text-sm font-medium">💼</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Offres Actives</dt>
                      <dd className="text-lg font-medium text-gray-900">{reportData.totalJobPostings}</dd>
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
                      <span className="text-white text-sm font-medium">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Candidats</dt>
                      <dd className="text-lg font-medium text-gray-900">{reportData.totalCandidates}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par statut */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Candidatures par Statut</h3>
                <div className="space-y-3">
                  {Object.entries(reportData.applicationsByStatus).map(([status, count]) => {
                    const percentage = Math.round((count / reportData.totalApplications) * 100);
                    const statusLabels = {
                      pending: 'En attente',
                      in_review: 'En révision',
                      interviewed: 'Entretien',
                      rejected: 'Rejeté',
                      hired: 'Embauché'
                    };
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{statusLabels[status as keyof typeof statusLabels]}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{count} ({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Compétences les plus demandées */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Compétences</h3>
                <div className="space-y-3">
                  {reportData.topSkills.map((skill, index) => (
                    <div key={skill.skill} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                        <span className="text-sm text-gray-600">{skill.skill}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{skill.count} candidats</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Évolution mensuelle */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Évolution des Candidatures</h3>
              <div className="flex items-end space-x-2 h-32">
                {reportData.applicationsByMonth.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(month.count / 35) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                    <span className="text-xs font-medium text-gray-900">{month.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

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
      const response = await fetch('http://localhost:8082/api/reports');
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData(null);
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
  );
}
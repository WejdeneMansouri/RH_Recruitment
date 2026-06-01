"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobPostingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    status: 'Open',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deadlineIso = formData.deadline ? new Date(formData.deadline).toISOString() : null;
      const response = await fetch('http://localhost:8082/api/job-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          deadline: deadlineIso,
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        router.push('/dashboard/job-postings');
      } else {
        console.error('Error creating job posting');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <Link href="/dashboard/job-postings" className="text-blue-600 font-medium px-3 py-2">Offres</Link>
              <Link href="/dashboard/candidates" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidats</Link>
              <Link href="/dashboard/applications" className="text-gray-700 hover:text-blue-600 px-3 py-2">Candidatures</Link>
              <Link href="/dashboard/reports" className="text-gray-700 hover:text-blue-600 px-3 py-2">Rapports</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link href="/dashboard/job-postings" className="text-blue-600 hover:text-blue-800">
              ← Retour aux offres
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer une Nouvelle Offre d'Emploi</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre du poste
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: Développeur Full Stack Senior"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description du poste
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Décrivez le poste, les missions, l'environnement de travail..."
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                Exigences et compétences requises
              </label>
              <textarea
                name="requirements"
                id="requirements"
                required
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Liste des compétences, expérience requise, diplômes..."
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Date limite de candidature
              </label>
              <input
                type="datetime-local"
                name="deadline"
                id="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Open">Ouvert</option>
                <option value="Closed">Fermé</option>
                <option value="Draft">Brouillon</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <Link href="/dashboard/job-postings" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer l\'offre'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditJobPostingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Open');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:8082/api/job-postings/${id}`);
      if (!res.ok) {
        setError('Offre introuvable');
        return;
      }
      const data = await res.json();
      setTitle(data.title || '');
      setDescription(data.description || '');
      setRequirements(data.requirements || '');
      setStatus(data.status || 'Open');
      setDeadline(data.deadline ? new Date(data.deadline).toISOString().slice(0,16) : '');
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement de l\'offre');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload: any = {
        title,
        description,
        requirements,
        status,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      };

      const res = await fetch(`http://localhost:8082/api/job-postings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Impossible de mettre à jour l\'offre');
        return;
      }

      router.push('/dashboard/job-postings');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Modifier l'offre</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required className="mt-1 block w-full rounded border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Compétences requises (séparées par des virgules)</label>
            <input value={requirements} onChange={(e) => setRequirements(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date limite</label>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full rounded border-gray-300">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

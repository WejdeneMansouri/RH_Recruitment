"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string;
  experienceYears: number;
  resumePath?: string;
}

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
  candidateId?: number;
}

export default function CandidateProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
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
    fetchCandidate(parsed.candidateId);
  }, [router]);

  const fetchCandidate = async (candidateId: number) => {
    try {
      const response = await fetch(`http://localhost:8082/api/candidates/${candidateId}`);
      if (!response.ok) {
        throw new Error('Impossible de récupérer le profil');
      }
      setCandidate(await response.json());
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors du chargement du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!user?.candidateId || !resumeFile) {
      setMessage('Sélectionnez un CV pour le téléverser.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    const response = await fetch(`http://localhost:8082/api/candidates/${user.candidateId}/resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      setMessage(errorText || 'Impossible de téléverser le CV.');
      return;
    }

    const updatedCandidate = await response.json();
    setCandidate(updatedCandidate);
    setMessage('CV mis à jour avec succès.');
    setResumeFile(null);
  };

  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState<Partial<Candidate>>({});

  useEffect(() => {
    if (candidate) setFormValues(candidate);
  }, [candidate]);

  const handleChange = (field: keyof Candidate, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!user?.candidateId) return setMessage('Utilisateur non authentifié.');

    try {
      const response = await fetch(`http://localhost:8082/api/candidates/${user.candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || 'Impossible de mettre à jour le profil.');
      }
      const updated = await response.json();
      setCandidate(updated);
      setEditing(false);
      setMessage('Profil mis à jour.');
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recruitmentUser');
    router.push('/candidate/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-8">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon profil candidat</h1>
            <p className="text-gray-600 mt-2">Consultez vos informations, votre CV et les recommandations de postes.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/candidate/job-postings" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Offres recommandées
            </Link>
            <button onClick={handleLogout} className="rounded-md border border-red-200 bg-white px-4 py-2 text-red-600 hover:bg-red-50">
              Déconnexion
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-blue-900">
            {message}
          </div>
        )}

        {candidate ? (
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails personnels</h2>
              <dl className="space-y-4 text-sm text-gray-700">
                <div>
                  <dt className="font-semibold">Nom</dt>
                  <dd>{candidate.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd>{candidate.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Téléphone</dt>
                  <dd>{candidate.phone || 'Non renseigné'}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Adresse</dt>
                  <dd>{candidate.address || 'Non renseignée'}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Compétences</dt>
                  <dd>{candidate.skills || 'Non renseignées'}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Années d'expérience</dt>
                  <dd>{candidate.experienceYears ?? 0} ans</dd>
                </div>
              </dl>

              <div className="mt-8 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">CV</h3>
                {candidate.resumePath ? (
                  <a
                    href={`http://localhost:8082/api/candidates/${candidate.id}/resume/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Télécharger mon CV
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">Aucun CV téléchargé.</p>
                )}
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Modifier le profil</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {editing ? 'Annuler' : 'Modifier le profil'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      value={formValues.name ?? ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="mt-2 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      value={formValues.phone ?? ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="mt-2 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                    <input
                      value={formValues.address ?? ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="mt-2 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compétences (séparées par des virgules)</label>
                    <input
                      value={formValues.skills ?? ''}
                      onChange={(e) => handleChange('skills', e.target.value)}
                      className="mt-2 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Années d'expérience</label>
                    <input
                      type="number"
                      value={formValues.experienceYears ?? 0}
                      onChange={(e) => handleChange('experienceYears', parseInt(e.target.value || '0'))}
                      className="mt-2 block w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">Enregistrer</button>
                    <button type="button" onClick={() => { setEditing(false); setFormValues(candidate || {}); }} className="rounded-md border px-4 py-2">Annuler</button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-gray-600">Cliquez sur « Modifier le profil » pour mettre à jour vos informations et compétences.</p>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Téléverser un nouveau CV</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">CV</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    className="mt-2 block w-full text-sm text-gray-700"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Mettre à jour le CV
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-gray-600">Impossible de charger les informations du profil.</p>
          </div>
        )}
      </div>
    </div>
  );
}

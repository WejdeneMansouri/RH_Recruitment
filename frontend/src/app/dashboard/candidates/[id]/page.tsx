"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string;
  experienceYears: number;
  resumePath?: string;
  createdAt: string;
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnCandidate, setIsOwnCandidate] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }

    // Determine whether the logged-in user is the candidate themselves
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recruitmentUser') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // parsed may contain candidateId when login as candidate
        if (parsed.role === 'Candidate' && parsed.candidateId) {
          setIsOwnCandidate(Number(parsed.candidateId) === Number(id));
        }
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/candidates/${id}`);
      if (!response.ok) {
        setError('Impossible de charger le candidat.');
        return;
      }
      setCandidate(await response.json());
    } catch (err) {
      console.error(err);
      setError('Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="px-4 py-6 sm:px-0">Chargement du candidat…</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <Link href="/dashboard/candidates" className="text-blue-600 hover:text-blue-800">
        ← Retour à la liste des candidats
      </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : candidate ? (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                  <p className="text-gray-600 mt-2">Candidat inscrit le {new Date(candidate.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  {isOwnCandidate ? (
                    <Link href="/candidate/profile" className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                      Modifier
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations</h2>
                  <dl className="space-y-4 text-sm text-gray-700">
                    <div>
                      <dt className="font-medium">Email</dt>
                      <dd>{candidate.email}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Téléphone</dt>
                      <dd>{candidate.phone || 'Non renseigné'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Adresse</dt>
                      <dd>{candidate.address || 'Non renseignée'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Compétences</dt>
                      <dd>{candidate.skills || 'Non renseignées'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Expérience</dt>
                      <dd>{candidate.experienceYears ?? 0} ans</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl bg-slate-50 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">CV</h2>
                  {candidate.resumePath ? (
                    <a
                      href={`http://localhost:8082/api/candidates/${candidate.id}/resume/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Voir / télécharger le CV
                    </a>
                  ) : (
                    <p className="text-gray-600">Aucun CV téléchargé.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600">Candidat introuvable.</p>
          )}
        </div>
      </div>
  );
}

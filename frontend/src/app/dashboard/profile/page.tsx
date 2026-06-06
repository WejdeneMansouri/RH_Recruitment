"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AdminData {
  userId?: number;
  email?: string;
  name?: string;
  role?: string;
  candidateId?: number | null;
  password?: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const stored = globalThis.window ? localStorage.getItem('recruitmentUser') : null;
    if (!stored) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AdminData;
      if (parsed.role === 'Candidate') {
        router.push('/candidate/dashboard');
        return;
      }
      setAdmin(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  if (!admin) {
    return <div className="text-center py-12">Chargement du profil admin…</div>;
  }

  const handleSave = () => {
    const updatedAdmin: AdminData = {
      ...admin,
      name,
      email,
      password: password || admin.password,
    };
    localStorage.setItem('recruitmentUser', JSON.stringify(updatedAdmin));
    setAdmin(updatedAdmin);
    setPassword('');
    alert('Profil mis à jour !');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Profil administrateur</h1>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-name" className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              id="admin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour garder le mot de passe actuel"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600">Vous pouvez modifier vos informations et/ou votre mot de passe ici.</p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

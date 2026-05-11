"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const response = await fetch('http://localhost:8082/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError('Email ou mot de passe incorrect.');
      return;
    }

    const data = await response.json();
    
    if (data.role === 'Candidate') {
      setError('Cet utilisateur est un candidat. Veuillez utiliser la page candidat.');
      return;
    }

    localStorage.setItem('recruitmentUser', JSON.stringify(data));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h1 className="text-2xl font-bold">Connexion Admin</h1>
          <p className="text-sm text-gray-600 mt-2">
            Accédez à votre espace administrateur pour gérer les offres et candidatures.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          <Link href="/auth" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CandidateLoginPage() {
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
    localStorage.setItem('recruitmentUser', JSON.stringify(data));

    if (data.role === 'Candidate') {
      router.push('/candidate/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Connexion candidat</h1>
        <p className="text-sm text-gray-600 mb-6">
          Connectez-vous pour accéder à votre espace candidat et postuler aux offres.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Pas encore de compte ? <Link href="/candidate/register" className="text-blue-600 hover:underline">S'inscrire</Link>
        </p>
        <p className="text-sm text-gray-600 mt-3 text-center">
          <Link href="/auth" className="text-gray-600 hover:underline">Retour</Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

interface UserData {
  userId: number;
  email: string;
  name: string;
  role: string;
  candidateId?: number | null;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recruitmentUser') : null;
    if (!stored) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsed = JSON.parse(stored) as UserData;
      if (parsed.role === 'Candidate') {
        router.push('/candidate/dashboard');
        return;
      }
      setUser(parsed);
    } catch (e) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('recruitmentUser');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800">
              Recruitment Management
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Dashboard
              </Link>
              <Link href="/dashboard/job-postings" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Offres
              </Link>
              <Link href="/dashboard/candidates" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Candidats
              </Link>
              <Link href="/dashboard/applications" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Candidatures
              </Link>
              <Link href="/dashboard/reports" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Rapports
              </Link>
              <div className="border-l border-gray-300 pl-4 flex items-center space-x-3">
                {user && (
                  <>
                    <Link href="/dashboard/profile" className="flex items-center space-x-2 group">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.role}</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-medium"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

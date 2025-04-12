'use client';
import { useAuth } from '../context/AuthContext';
import Sidebar from './ui/Sidebar';
import { useRouter } from 'next/navigation';
import Loader from './ui/Loader';

export default function Layout({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Loader />;
  }

  if (!currentUser) {
    return children;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
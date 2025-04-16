'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Button from '../components/ui/Button';

export default function Home() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while determining auth state
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Task Management System</h1>
        <p className="text-xl text-gray-600 mb-8">
          Organize your work, collaborate with your team, and get things done efficiently.
        </p>

        {currentUser ? (
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
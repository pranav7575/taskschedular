'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import SocialAuth from './SocialAuth';
import Button from '../ui/Button';

export default function AuthForm({ title, subtitle, action, linkText, linkHref }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false); // renamed to avoid clash with auth's loading
  const { signup, login, resetPassword, loading } = useAuth(); // pulling loading from auth context
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>; // show while checking auth state
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      if (action === 'register') {
        await signup(email, password);
        router.push('/dashboard');
      } else if (action === 'login') {
        await login(email, password);
        router.push('/dashboard');
      } else if (action === 'reset') {
        await resetPassword(email);
        alert('Password reset email sent!');
        router.push('/auth/login');
      }
    } catch (err) {
      setError(err.message);
    }

    setProcessing(false);
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {action !== 'reset' && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        )}

        {action === 'login' && (
          <div className="flex items-center justify-end">
            <Link href="/reset-password" className="text-sm text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={processing}>
          {processing
            ? 'Processing...'
            : action === 'register'
            ? 'Sign Up'
            : action === 'login'
            ? 'Log In'
            : 'Reset Password'}
        </Button>
      </form>

      {action !== 'reset' && <SocialAuth action={action} />}

      <div className="mt-6 text-center">
        <Link href={linkHref} className="text-sm text-indigo-600 hover:text-indigo-500">
          {linkText}
        </Link>
      </div>
    </div>
  );
}

// components/SignOutButton.js
'use client';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push('/auth/login'); // Redirect to login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button 
      onClick={handleSignOut}
      className="text-red-600 hover:text-red-800"
    >
      Sign Out
    </button>
  );
}
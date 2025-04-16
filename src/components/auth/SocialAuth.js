import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import Button from '../ui/Button';
import { GoogleIcon } from '../ui/Icons';
import { useAuth } from '../../context/AuthContext';

export default function SocialAuth({ action }) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // Wait for the currentUser to update
      const waitForAuth = new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve();
          }
        });
      });

      await waitForAuth;
      router.push('/dashboard'); // Redirect to dashboard after auth state updates
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or {action === 'login' ? 'sign in' : 'sign up'} with
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center"
        >
          <GoogleIcon className="h-5 w-5 mr-2" />
          Google
        </Button>
      </div>
    </div>
  );
}
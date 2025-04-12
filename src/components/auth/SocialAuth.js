import { useAuth } from '../../context/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../firebase/config';
import Button from '../ui/Button';
import { GoogleIcon } from '../ui/Icons';
import { useAppNotification } from '../../context/NotificationContext';


export default function SocialAuth({ action }) {
  const { showNotification } = useAppNotification();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showNotification(`Signed in with Google successfully`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
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
import { auth } from '../../../../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { createUserProfile } from '../../../../firebase/services';

export async function POST(request) {
  const { action, email, password, name } = await request.json();

  try {
    if (action === 'register') {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        name,
        email,
        createdAt: new Date()
      });

      return Response.json({ 
        success: true, 
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName
        }
      });
    } else if (action === 'login') {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return Response.json({ 
        success: true, 
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName
        }
      });
    } else if (action === 'reset') {
      await sendPasswordResetEmail(auth, email);
      return Response.json({ success: true });
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
'use client'; 
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import SignOutButton from '@/components/SignOutButton';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { uploadFileToS3 } from '../../../firebase/s3Service';
import Image from 'next/image';

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
];

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState('light');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(10);
      
      // Upload to S3 instead of Firebase Storage
      const s3ImageUrl = await uploadFileToS3(file, currentUser.uid);
      setUploadProgress(80);
      
      // Update user profile with the S3 URL
      await updateProfile(auth.currentUser, {
        photoURL: s3ImageUrl
      });
      
      // Update the user document in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        photoURL: s3ImageUrl,
        updatedAt: new Date()
      }, { merge: true });
      
      setPhotoURL(s3ImageUrl);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        setSuccess('Profile image updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      }, 500);
    } catch (error) {
      setError(error.message);
      setUploadProgress(0);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: name
      });

      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Create or update user document in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        displayName: name,
        email: email,
        photoURL: photoURL,
        themePreference: theme,
        updatedAt: new Date()
      }, { merge: true }); // merge: true will update if exists or create if not

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 mt-10">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
              {photoURL ? (
             <Image
             src={photoURL}
             alt="Profile"
             fill
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             className="object-cover"
           />
           
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">
                    {name.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current.click()}
              className="w-full sm:w-auto"
              disabled={uploadProgress > 0}
            >
              {uploadProgress > 0 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Change Photo'}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
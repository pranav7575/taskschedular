import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Notification({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${bgColor[type]} notification-slide-in`}>
      <div className="flex items-center">
        <p className="mr-4">{message}</p>
        <button onClick={onClose} className="text-current hover:opacity-75">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
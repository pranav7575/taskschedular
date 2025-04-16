// components/ui/Avatar.js
'use client';
import Image from "next/image";
export default function Avatar({ name, size = 'md', src, className }) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base'
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <Image src={src} alt={name} className="rounded-full" />
      ) : (
        <span className="text-gray-700 dark:text-gray-300">
          {name.split(' ').map(n => n[0]).join('')}
        </span>
      )}
    </div>
  );
}
import { useState } from 'react';
import Image from "next/image";

export default function FileUpload({ onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  };

  return (
    <div>
      {preview && <Image src={preview} alt="Preview" className="w-32 h-32 rounded-full mb-4" />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}
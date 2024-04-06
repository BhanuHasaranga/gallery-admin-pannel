'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

export default function ImageUploadForm() {
  const [inProgress, setInProgress] = useState(false);
  const [fileBase64Image, setFileBase64Image] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newImageFile = event.target.files?.[0] || null;

    if (newImageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFileBase64Image(base64String);
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
      };
      reader.readAsDataURL(newImageFile);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInProgress(true);

    try {
      if (!fileBase64Image) {
        throw new Error('No image selected');
      }

      const formData = new FormData();
      formData.append('imageFile', fileBase64Image);

      const response = await fetch('/api/images2', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const responseData = await response.json();
      console.log('New Image:', responseData.newImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error or show user-friendly message
    } finally {
      setInProgress(false);
    }
  };

  const styles = {
    form: 'bg-gray-100 p-4 rounded-lg',
    input: 'border p-2 mb-4 w-full border-gray-300 rounded',
    button: 'bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors',
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className="flex items-center mb-4">
        <label htmlFor="imageFile" className="mr-4">
          Upload Image:
        </label>
        <input
          type="file"
          id="imageFile"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.input}
        />
      </div>

      {/* Submit button */}
      <button type="submit" className={styles.button} disabled={inProgress}>
        {inProgress ? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  );
}

'use client'
import React, { useState } from 'react';

export default function UploadForm() {
    const [inProgress, setInProgress] = useState(false);
    const [albumName, setAlbumName] = useState<string>('');
    const [albumDescription, setAlbumDescription] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInProgress(true);

        const data = {
            name: albumName,
            description: albumDescription,
        };

        try {
            const response = await fetch('/api/albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to upload album');
            }

            const responseData = await response.json();
            console.log('New Album:', responseData.newAlbum);
        } catch (error) {
            console.error('Error uploading album:', error);
        }

        setInProgress(false);
    };

    // Object containing CSS styles
    const styles = {
        form: "bg-gray-100 p-4 rounded-lg", // Styling for the form container
        input: "border p-2 mb-4 w-full border-gray-300 rounded", // Styling for the file input
        button: "bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors", // Styling for the upload button
        previewContainer: "mt-4", // Styling for the container of the image preview
        previewImage: "rounded-lg", // Styling for the image preview
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type='text'
                placeholder='Album Name'
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                className={styles.input}
            />

            <input
                type='text'
                placeholder='Album Description'
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                className={styles.input}
            />

            <button className={styles.button} type='submit' disabled={inProgress}>
                {inProgress ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}

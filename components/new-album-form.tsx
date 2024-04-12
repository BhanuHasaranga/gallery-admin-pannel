'use client';

import React, { useState } from 'react';

export default function UploadForm() {
    const [inProgress, setInProgress] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [albumType, setAlbumType] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInProgress(true);

        if (!files || files.length === 0) {
            console.error('No files selected');
            return;
        }

        const formData = new FormData();
        formData.set('name', albumName);
        formData.set('description', albumDescription);
        formData.set('type', albumType);

        // Append all selected files to the FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch('/api/albums', {
                method: 'POST',
                body: formData,
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);
    };

    const styles = {
        form: "bg-gray-100 p-4 rounded-lg",
        input: "border p-2 mb-4 w-full border-gray-300 rounded",
        button: "text-sm font-normal text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors",
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

            <select
                value={albumType}
                onChange={(e) => setAlbumType(e.target.value)}
                className={styles.input}
            >
                <option value="">Select Album Type</option>
                <option value="photography">Photography</option>
                <option value="video production">Video Production</option>
            </select>

            <input
                type="file"
                name="files"
                multiple
                onChange={handleFileChange}
            />

            <button className={styles.button} type='submit' disabled={inProgress || !files}>
                {inProgress ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}

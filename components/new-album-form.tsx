import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export default function UploadForm() {
    const [inProgress, setInProgress] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [albumType, setAlbumType] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInProgress(true);

        if (!files || files.length === 0) {
            console.error('No files selected');
            return;
        }

        if (fileError) {
            console.error('Invalid file type selected');
            return;
        }

        const formData = new FormData();
        formData.set('name', albumName);
        formData.set('description', albumDescription);
        formData.set('type', albumType);
        let totalSize = 0;

        // Append all selected files to the FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
            totalSize += files[i].size;
        }

        try {
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / totalSize) * 100);
                    setUploadProgress(progress);
                },
            };

            const response = await axios.post('/api/albums', formData, config);

            console.log('New Album:', response.data.newAlbum);

            new Notification('Album uploaded successfully!');
            window.location.href = 'https://regalia.lk/'; //redirect to success page
        } catch (error) {
            console.error('Error uploading album:', error);
        } finally {
            setInProgress(false);
            setUploadProgress(0); // Reset progress after upload completes or fails
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);

        if (selectedFiles && selectedFiles.length > 0) {
            const isValidType = validateFileType(albumType, selectedFiles);
            if (!isValidType) {
                setFileError(`Invalid file type for ${albumType}`);
            } else {
                setFileError(null);
            }
        }
    };

    const validateFileType = (type: string, files: FileList | null) => {
        if (!files) return false;

        const allowedTypes: Record<string, string[]> = {
            photography: ['image/jpeg', 'image/png', 'image/gif'],
            'video production': ['video/mp4', 'video/mpeg', 'video/quicktime'],
        };

        const acceptedTypes = allowedTypes[type];
        if (!acceptedTypes) return false;

        for (let i = 0; i < files.length; i++) {
            if (!acceptedTypes.includes(files[i].type)) {
                return false;
            }
        }

        return true;
    };

    const styles = {
        form: "bg-gray-100 p-10 mx-14 rounded-lg",
        input: "border p-2 mb-4 w-full border-gray-300 rounded",
        button: "text-sm font-normal text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors",
        error: "text-red-500 text-sm mt-1",
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
                onChange={(e) => {
                    setAlbumType(e.target.value);
                    setFileError(null); // Reset file error when album type changes
                }}
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
            
            {fileError && <p className={styles.error}>{fileError}</p>}

            {uploadProgress > 0 && (
                <p className="text-sm text-gray-500">{`Uploading: ${uploadProgress}%`}</p>
            )}

            <button className={styles.button} type='submit' disabled={inProgress || !files || !!fileError}>
                {inProgress ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}

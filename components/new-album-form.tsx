import React, { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Link from 'next/link';

export default function UploadForm() {
    const [inProgress, setInProgress] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [albumType, setAlbumType] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // State to store thumbnail URL

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

        if (!formData) {
            console.error('FormData not initialized');
            return;
        }

        try {
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total !== undefined) {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                    }
                },
            };

            const response = await axios.post('/api/albums', formData, config);

            console.log('New Album:', response);
            console.log('Album uploaded successfully!');

            new Notification('Album uploaded successfully!');
            window.location.href = "https://notifications.regalia.lk/";
        } catch (error) {
            console.error('Error uploading album:', error);
        } finally {
            setInProgress(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);

        if (selectedFiles && selectedFiles.length > 0) {
            const isValidType = validateFileType(albumType, selectedFiles);
            if (!isValidType) {
                setFileError(`Invalid file type for ${albumType}`);
            } else {
                setFileError(null);

                const newFormData = new FormData();
                newFormData.set('name', albumName);
                newFormData.set('description', albumDescription);
                newFormData.set('type', albumType);

                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    newFormData.append('files', file);

                    if (albumType === 'video production' && file.type.startsWith('video/')) {
                        const thumbnail = await generateVideoThumbnail(file);
                        if (thumbnail) {
                            newFormData.set('thumbnail', thumbnail);
                            const thumbnailBlobUrl = URL.createObjectURL(thumbnail);
                            setThumbnailUrl(thumbnailBlobUrl);
                        }
                    }
                }
                setFormData(newFormData);
            }
        }
    };

    const generateVideoThumbnail = (file: File) => {
        return new Promise<File | null>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
    
            video.onloadedmetadata = async () => {
                video.currentTime = 1;
                await video.play().catch(() => {});
    
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
    
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
                            resolve(thumbnailFile);
                        } else {
                            resolve(null);
                        }
                    }, 'image/jpeg');
                } else {
                    resolve(null);
                }
            };
    
            video.src = URL.createObjectURL(file);
        });
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
                    setFileError(null);
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
                multiple={albumType !== 'video production'}
                onChange={handleFileChange}
            />
            
            {fileError && <p className={styles.error}>{fileError}</p>}

            {thumbnailUrl && (
                <div>
                    <p>Generated Thumbnail:</p>
                    <img src={thumbnailUrl} alt="Video Thumbnail" className="w-64 h-auto" />
                </div>
            )}

            <div className="flex py-4 justify-between w-80">
                <Link href={"/admin-pannel/"}>
                  <button
                   className="text-sm font-normal text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </Link>
                {uploadProgress > 0 && (
                  <p className="text-sm text-gray-500">{`Uploading: ${uploadProgress}%`}</p>
                )}
                <button
                 type="submit"
                 className="text-sm font-normal text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                 disabled={inProgress}
                >
                  {inProgress ? "Updating..." : "Update"}
                </button>
            </div>
        </form>
    );
}

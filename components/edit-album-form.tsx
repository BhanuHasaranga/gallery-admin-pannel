import Link from "next/link";
import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

interface EditFormProps {
  albumInfo: any;
}

const EditForm: React.FC<EditFormProps> = ({ albumInfo }) => {
  const [inProgress, setInProgress] = useState(false);
  const [albumName, setAlbumName] = useState(albumInfo.name);
  const [albumDescription, setAlbumDescription] = useState(albumInfo.description);
  const [files, setFiles] = useState<FileList | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatedUrlIds, setUpdatedUrlIds] = useState<number[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInProgress(true);

    console.log("Form submitted. Album ID:", albumInfo.id);

    const formData = new FormData();
    formData.append("id", albumInfo.id);
    let totalSize = 0;

    if (albumName.trim() !== "") {
      formData.append("name", albumName);
      console.log("Album name updated:", albumName);
    }

    if (albumDescription.trim() !== "") {
      formData.append("description", albumDescription);
      console.log("Album description updated:", albumDescription);
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i]);
        console.log("File added:", files[i].name);
        totalSize += files[i].size;
      }
    }

    if (updatedUrlIds.length > 0) {
      formData.append("updatedUrlIds", updatedUrlIds.join(","));
      console.log("Updated URL IDs to delete:", updatedUrlIds);
    }

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / totalSize) * 100);
        setUploadProgress(progress);
      },
    };

    try {
      const response = await axios.post("/api/albums/album", formData, config);

      console.log("Album updated successfully:", response.data.message);

      // Assuming the update was successful, clear updatedUrlIds
      setUpdatedUrlIds([]);

      // Redirect to success page
      new Notification('Album updated successfully!');
      window.location.href = "https://notifications.regalia.lk/";

    } catch (error) {
      console.error("Error updating album:", error);
      setErrorMessage("Failed to update album. Please try again.");
    } finally {
      setInProgress(false);
      setUploadProgress(0); // Reset progress after upload completes or fails
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (confirmDelete) {
      // Find the corresponding URL object and get its ID
      const urlToDelete = albumInfo.urls.find((url: any) => url.url === imageUrl);
      if (urlToDelete) {
        // Add the ID to updatedUrlIds
        setUpdatedUrlIds([...updatedUrlIds, urlToDelete.id]);
        console.log("Image deleted. URL ID to delete:", urlToDelete.id);

        // Filter out the deleted image from albumInfo.urls to remove it from view
        const updatedUrls = albumInfo.urls.filter((url: any) => url.url !== imageUrl);
        albumInfo.urls = updatedUrls;
      }
    }
  };

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
    console.log("Album name changed:", e.target.value);
  };

  const handleAlbumDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumDescription(e.target.value);
    console.log("Album description changed:", e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const isValidType = validateFileType(albumInfo.type, selectedFiles);
      if (!isValidType) {
        setErrorMessage(`Invalid file type for ${albumInfo.type}`);
      } else {
        setFiles(selectedFiles);
        setErrorMessage(null);
        console.log("Files selected:", selectedFiles);
      }
    }
  };

  const validateFileType = (albumType: string, files: FileList) => {
    const allowedTypes: Record<string, string[]> = {
      photography: ["image/jpeg", "image/png", "image/gif"],
      "video production": ["video/mp4", "video/mpeg", "video/quicktime"],
    };

    const acceptedTypes = allowedTypes[albumType];
    if (!acceptedTypes) return false;

    for (let i = 0; i < files.length; i++) {
      if (!acceptedTypes.includes(files[i].type)) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg">
        <p>Album Name:</p>
        <input
          type="text"
          value={albumName}
          onChange={handleAlbumNameChange}
          className="border p-2 mb-4 w-full border-gray-300 rounded"
        />

        <p>Album Description:</p>
        <input
          type="text"
          value={albumDescription}
          onChange={handleAlbumDescriptionChange}
          className="border p-2 mb-4 w-full border-gray-300 rounded"
        />

        <input
          type="file"
          name="files"
          multiple
          onChange={handleFileChange}
          accept={
            albumInfo.type === "photography"
              ? "image/jpeg, image/png, image/gif"
              : albumInfo.type === "video production"
              ? "video/mp4, video/mpeg, video/quicktime"
              : ""
          }
        />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex py-4 justify-between w-80">
          <Link href={`/admin-panel/${albumInfo.id}`}>
            <button className="text-sm font-normal text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {albumInfo.urls.map((url: any) => (
          <div key={url.id} className="relative overflow-hidden rounded-lg shadow-sm">
            {albumInfo.type === "photography" ? (
              <img src={url.url} alt={`Image ${url.id}`} className="w-full h-64 object-cover" />
            ) : albumInfo.type === "video production" ? (
              <video controls className="w-full h-64 object-cover">
                <source src={url.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Unsupported media type</p>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
              <button
                className="text-sm font-normal text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                onClick={() => handleDeleteImage(url.url)}
              >
                Delete
              </button>
              {/* Display the URL ID alongside the image */}
              <p className="text-xs text-gray-400">ID: {url.id}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EditForm;

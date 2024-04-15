import React, { useState } from "react";

interface EditFormProps {
  albumInfo: any;
}

const EditForm: React.FC<EditFormProps> = ({ albumInfo }) => {
  // State hooks for form elements and interaction
  const [inProgress, setInProgress] = useState(false);
  const [albumName, setAlbumName] = useState(albumInfo.name);
  const [albumDescription, setAlbumDescription] = useState(albumInfo.description);
  const [files, setFiles] = useState<FileList | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatedUrlIds, setUpdatedUrlIds] = useState<number[]>([]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInProgress(true);

    const formData = new FormData();
    formData.append("id", albumInfo.id);

    if (albumName.trim() !== "") {
      formData.append("name", albumName);
    }

    if (albumDescription.trim() !== "") {
      formData.append("description", albumDescription);
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i]);
      }
    }

    if (updatedUrlIds.length > 0) {
      formData.append("updatedUrlIds", updatedUrlIds.join(","));
    }

    try {
      const response = await fetch("/api/albums/album", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update album");
      }

      const responseData = await response.json();

      // Reset updatedUrlIds after successful update
      setUpdatedUrlIds([]);

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating album:", error);
      setErrorMessage("Failed to update album. Please try again.");
    }

    setInProgress(false);
  };

  // Handle image deletion
  const handleDeleteImage = (imageUrl: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (confirmDelete) {
      const urlToDelete = albumInfo.urls.find((url: any) => url.url === imageUrl);
      if (urlToDelete) {
        // Add the image ID to updatedUrlIds for deletion on submit
        setUpdatedUrlIds([...updatedUrlIds, urlToDelete.id]);

        // Update the local state to remove the image from display
        const updatedUrls = albumInfo.urls.filter((url: any) => url.url !== imageUrl);
        albumInfo.urls = updatedUrls;
      }
    }
  };

  // Handle album name change
  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  // Handle album description change
  const handleAlbumDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumDescription(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  };

  // Render the edit form and display existing images
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

        <input type="file" name="files" multiple onChange={handleFileChange} />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          className="text-sm font-normal text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
          disabled={inProgress}
        >
          {inProgress ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {/* Display existing images with delete functionality */}
        {albumInfo.urls.map((url: any) => (
          <div key={url.id} className="relative overflow-hidden rounded-lg shadow-sm">
            <img src={url.url} alt={`Image ${url.id}`} className="w-full h-64 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
              <button
                className="text-sm font-normal text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                onClick={() => handleDeleteImage(url.url)}
              >
                Delete
              </button>
              <p className="text-xs text-gray-400">ID: {url.id}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EditForm;

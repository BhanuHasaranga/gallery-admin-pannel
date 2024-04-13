"use client";

import React, { useState } from "react";

interface EditFormProps {
  albumInfo: { name: string; description: string };
}

const EditForm: React.FC<EditFormProps> = ({ albumInfo }) => {
  const [inProgress, setInProgress] = useState(false);
  const [albumName, setAlbumName] = useState(albumInfo.name);
  const [albumDescription, setAlbumDescription] = useState(albumInfo.description);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInProgress(true);

    const formData = new FormData();
    formData.append("id", "1"); // Replace '1' with the actual album ID

    if (albumName.trim() !== "") {
      formData.append("name", albumName);
    }

    if (albumDescription.trim() !== "") {
      formData.append("description", albumDescription);
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
      console.log("Album updated successfully:", responseData.message);
    } catch (error) {
      console.error("Error updating album:", error);
      setErrorMessage("Failed to update album. Please try again.");
    }

    setInProgress(false);
  };

  const handleAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumName(e.target.value);
  };

  const handleAlbumDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumDescription(e.target.value);
  };

  return (
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

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        type="submit"
        className="text-sm font-normal text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
        disabled={inProgress}
      >
        {inProgress ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditForm;

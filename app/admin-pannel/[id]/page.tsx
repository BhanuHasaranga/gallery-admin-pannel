'use client';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AlbumInfo = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Extract album ID from URL path

  const [albumData, setAlbumData] = useState(null); // State to hold album data

  useEffect(() => {
    const fetchSingleAlbum = async (id) => {
      try {
        const response = await fetch(`/api/albums/album?id=${id}`); // Fetch data for a specific album
        if (!response.ok) {
          throw new Error("Failed to fetch album");
        }
        const data = await response.json();
        setAlbumData(data); // Set fetched album data to state
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    if (id) {
      fetchSingleAlbum(id); // Fetch album data when ID is available
    }
  }, [id]); // Re-run effect when ID changes

  // Render loading state while albumData is being fetched
  if (!albumData) {
    return <p>Loading...</p>;
  }

  // Determine the rendering based on album type
  const renderMedia = () => {
    if (albumData.type === 'photography') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
          {albumData.urls.map((imageUrl, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-sm">
              <img src={imageUrl} alt={`Image ${index}`} className="w-full h-64 object-cover" />
            </div>
          ))}
        </div>
      );
    } else if (albumData.type === 'video production') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
          {albumData.urls.map((videoUrl, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-sm">
              <video controls className="w-full h-64 object-cover">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      );
    } else {
      return <p>Unsupported album type</p>; // Handle unsupported types
    }
  };

  return (
    <div className="">
      <Navbar pageTitle={"ALBUM INFO"} submitBtnTitle={"Edit Album"} submitBtnPath={`/edit-album/${id}`} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Album Info</h2>
        <p className="text-gray-600">Title: {albumData.name}</p>
        <p className="text-gray-600">Description: {albumData.description}</p>
        <p className="text-gray-600">Type: {albumData.type}</p>
      </div>
      {renderMedia()} {/* Render media based on album type */}
    </div>
  );
};

export default AlbumInfo;

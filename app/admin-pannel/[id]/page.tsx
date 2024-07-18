// app\admin-pannel\[id]\page.tsx
'use client';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation'; // Corrected import
import React, { useEffect, useState } from 'react';
import NextLink from "next/link"
import axios from 'axios';

const AlbumInfo = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Extract album ID from URL path

  type Album = {
    id: number,
    name: string,
    description: string,
    type: string,
    urls: { id: number, url: string }[]; // Corrected type for urls array
  };

  const [albumData, setAlbumData] = useState<Album | null>(null); // State to hold album data

  useEffect(() => {
    const fetchSingleAlbum = async (id: string) => {
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

  // Render media based on album type
  const renderMedia = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {albumData.urls.map((mediaItem, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-sm">
            {/* Render image or video based on album type */}
            {albumData.type === 'photography' ? ( // Check if album type is 'photography'
              <img src={mediaItem.url} alt={`Image ${index}`} className="w-full h-64 object-cover" />
            ) : albumData.type === 'video production' ? ( // Check if album type is 'video production'
              <video controls className="w-full h-64 object-cover">
                <source src={mediaItem.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Unsupported media type</p> // Handle unsupported types
            )}
          </div>
        ))}
      </div>
    );
  };

  const deleteAlbum = async (albumId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this album?");
    const formData = new FormData();
    formData.append("id", albumId.toString()); // Convert albumId to string
    if (confirmDelete) {
      try {
        const response = await axios.post("/api/albums/album/del", formData);
        console.log("Album updated successfully:", response.data.message);
      } catch (error) {
        console.error("Error deleting album:", error);
      }
    }
    // Redirect to success page
    new Notification('Album deleted successfully!');
    window.location.href = "https://notifications.regalia.lk/";
  };
  
  


  return (
    <div className="">
      <Navbar pageTitle={"Album Info"} submitBtnTitle={"Back to Album Library"} submitBtnPath={"/admin-pannel"} />
      <div className="px-10 py-5">
        <div className="flex justify-between w-96">
          <h2 className="text-xl font-semibold mb-2">{albumData.name}</h2>
          <div className="flex justify-end">
            <NextLink href={`/edit-album/${id}`}>
              <button 
               className="text-sm font-normal text-gray-600 bg-gray-100 px-3 py-1 mx-1 rounded-md hover:bg-gray-200"
              >
                Edit Album
              </button>
            </NextLink>
            <div>
              <button 
               className="text-sm font-normal text-white bg-red-500 px-3 py-1 rounded-md hover:bg-gray-200 hover:text-gray-600"
               onClick={() => deleteAlbum(albumData.id)}
              >
                Delete Album
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-96">
          <p className="text-gray-600 py-2">Album id:</p>
          <p className="text-gray-600 py-2">{albumData.id}</p>
        </div>
        <div className="flex justify-between w-96">
          <p className="text-gray-600 py-2">Album title:</p>
          <p className="text-gray-600 py-2">{albumData.name}</p>
        </div>
        <div className="flex justify-between w-96">
          <p className="text-gray-600 py-2">Album type:</p>
          <p className="text-gray-600 py-2">{albumData.type}</p>
        </div>
        <div className="flex justify-between w-96">
          <p className="text-gray-600 py-2">Album description:</p>
          <p className="text-gray-600 py-2">{albumData.description}</p>
        </div>
        
      </div>
      {renderMedia()} {/* Render media based on album type */}
    </div>
  );
};

export default AlbumInfo;
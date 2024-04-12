'use client'
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AlbumInfo = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();

  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    const fetchSingleAlbum = async (id) => {
      try {
        const response = await fetch(`/api/albums/album?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch albums");
        }
        const data = await response.json();
        setAlbumData(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
        // Handle error state if needed
      }
    };

    if (id) {
      fetchSingleAlbum(id);
    }
  }, [id]);

  // Render loading state while albumData is being fetched
  if (!albumData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <Navbar pageTitle={"ALBUM INFO"} submitBtnTitle={"Edit Album"} submitBtnPath={`/edit-album/${id}`} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Album Info</h2>
        <p className="text-gray-600">Title: {albumData.name}</p>
        <p className="text-gray-600">Description: {albumData.description}</p>
        <p className="text-gray-600">Type: {albumData.type}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {albumData.urls.map((imageUrl, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-sm">
            <img src={imageUrl} alt={`Image ${index}`} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumInfo;

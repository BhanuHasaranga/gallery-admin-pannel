'use client'
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
    <div>
      <p>Album Info</p>
      <p>ID: {id}</p>
      {albumData && (
        <div>
          <p>Title: {albumData.name}</p>
          {/* Display other album info */}
        </div>
      )}
    </div>
  );
};

export default AlbumInfo;

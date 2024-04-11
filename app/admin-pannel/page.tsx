'use client'
import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/navbar'
import AlbumCard from '../components/album-card';

export default function AdminPannel() {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
      const fetchAlbums = async () => {
        try {
          const response = await fetch('/api/albums');
          if (!response.ok) {
            throw new Error('Failed to fetch albums');
          }
          const data = await response.json();
          setAlbums(data); // Assuming the API response is an array of album objects
        } catch (error) {
          console.error('Error fetching albums:', error);
          // Handle error state if needed
        }
      };
  
      fetchAlbums();
    }, []);
  return (
    <>
      <Navbar/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {/* Check if albums is an array and not empty before mapping */}
        {Array.isArray(albums) && albums.length > 0 ? (
          albums.map((album, index) => (
            <AlbumCard
              key={index}
              title={album.name}
              img={album.urls.length > 0 ? album.urls[0] : '/placeholder.jpg'}
            />
          ))
        ) : (
          <p>No albums found.</p>
        )}
      </div>
    </>
  )
}

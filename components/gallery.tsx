import React, { useEffect, useState } from 'react';
import { Navbar } from './navbar';
import AlbumCard from './album-card';
import { BrowserRouter as Router } from 'react-router-dom';

const getData = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos');
    if (!response.ok) {
      throw new Error('Failed to fetch albums');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return []; // Return an empty array in case of error to avoid undefined
  }
};

export default function AdminPanel() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getData();
        setAlbums(data);
      } catch (error) {
        console.error('Error setting albums:', error);
      }
    };

    fetchAlbums();
  }, []);


  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {albums.length > 0 ? (
          <AlbumCard albums={albums} />
        ) : (
          <p>Loading albums...</p>
        )}
      </div>
    </>
  );
}

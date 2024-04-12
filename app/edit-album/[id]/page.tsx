'use client'
import React , { useEffect, useState } from 'react'
import EditForm from '@/components/edit-album-form'
import { usePathname } from 'next/navigation';

export default function AddNewAlbum() {
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

  if (!albumData) {
    return <p>Loading...</p>;
  }

  return (
    <div className='py-4 px-16'>
      <p>Edit Album</p>
      <EditForm albumInfo={albumData}/>
    </div>
    
  )
}

//app\edit-album\[id]\page.tsx
'use client'
import React , { useEffect, useState } from 'react'
import EditForm from '@/components/edit-album-form'
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';

export default function AddNewAlbum() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();

  type Album = {
    id : any,
  } 

  const [albumData, setAlbumData] = useState<Album>();

  useEffect(() => {
    const fetchSingleAlbum = async (id: any) => {
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
    <>
      <Navbar pageTitle={"Edit Album"} submitBtnTitle={"Back to Album Library"} submitBtnPath={"/admin-pannel"} />
      <div className='py-4 px-16'>
        <p className='py-2'>Album id: {albumData.id}</p>
        <EditForm albumInfo={albumData}/>
      </div>
    </>
    
  )
}

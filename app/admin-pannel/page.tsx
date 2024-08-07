// app\admin-pannel\page.tsx
"use client"; // Enable client-side rendering

import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import AlbumCard from "../../components/album-card"; 
import Link from "next/link";

export default function AdminPanel() {

  type Album = {
    id: any,
    name: any,
    description: any,
    type: any, 
    urls: {
      url: any,
      thumbnail: any
    }[]
  }
  

  const [albums, setAlbums] = useState<Album[]>([]); // State to hold album data fetched from API

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/api/albums"); // Fetch albums data from the specified API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch albums");
        }
        const data = await response.json();
        console.log(data);
        setAlbums(data); // Set fetched album data to state
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
      <div>
        <Navbar
          pageTitle={"Album Library"} // Navbar component with specific props
          submitBtnTitle={"Add New Album"} 
          submitBtnPath="/add-new-album" 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
          {albums.length > 0 ? (
            albums.map((album) => ( // Map through albums array to render AlbumCard components
              <Link href={`admin-pannel/${album.id}`} key={album.id}>
                <AlbumCard
                  title={album.name}
                  img={
                    album.type === 'photography'
                      ? (album.urls.length > 0 ? album.urls[0].url : 'default-image-url') // Use URL for photography
                      : (album.urls.length > 0 ? album.urls[0].thumbnail : 'default-image-url') // Use thumbnail or URL for video production
                  }
                  albumId={album.id}
                  albumType={album.type}
                />
              </Link>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
  );
}

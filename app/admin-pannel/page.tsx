// app\admin-pannel\page.tsx
"use client"; // Enable client-side rendering

import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import AlbumCard from "../../components/album-card"; 
import { BrowserRouter as Router } from "react-router-dom";
import Link from "next/link";

export default function AdminPanel() {

  type Album = {
    id : any,
    name: any,
    description: any,
    type: any, 
    urls: any,
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
    <Router> {/* Wrap component with Router for client-side routing */}
      <>
        <Navbar
          pageTitle={"ALBUMS"} // Navbar component with specific props
          submitBtnTitle={"Add New Album"} 
          submitBtnPath="/add-new-album" 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
          {albums.length > 0 ? (
            albums.map((album) => ( // Map through albums array to render AlbumCard components
              <Link href={`admin-pannel/${album.id}`} key={album.id}>
                <AlbumCard
                  title={album.name}
                  img={album.urls[0]}
                  albumId={album.id}
                  albumType={album.type}
                />
              </Link>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </>
    </Router>
  );
}

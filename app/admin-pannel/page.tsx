//app/admin-pannel/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import AlbumCard from "../../components/album-card";
import { BrowserRouter as Router } from "react-router-dom";
import Link from "next/link";

export default function AdminPanel() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/api/albums");
        if (!response.ok) {
          throw new Error("Failed to fetch albums");
        }
        const data = await response.json();
        console.log(data);
        setAlbums(data); // Assuming the API response is an array of album objects
      } catch (error) {
        console.error("Error fetching albums:", error);
        // Handle error state if needed
      }
    };

    fetchAlbums();
  }, []);

  return (
    <Router>
    <>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
        {albums.length > 0 ? (
          albums.map((album) =>
            // Check if album has a valid ID before rendering Link
            <Link 
              href={{pathname: "/album-info", query: {id: album.id}}}
              key={album.id}
            >
              <AlbumCard
                title={album.name}
                img={album.urls[0]}
                albumId={album.id}
              />
            </Link>

          )
        ) : (
          <p>No albums found.</p>
        )}
      </div>
    </>
    </Router>
  );
}

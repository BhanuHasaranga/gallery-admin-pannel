// 'use client'

// import React, { useState, useEffect } from 'react';
// import { Navbar } from './components/navbar';
// import AlbumCard from './components/album-card';

// interface Album {
//   title: string;
//   urls: string[]; // Assuming 'urls' is an array of string (photo URLs)
// }

// const Home: React.FC = () => {
//   const [albums, setAlbums] = useState<Album[]>([]);

//   useEffect(() => {
//     const fetchAlbums = async () => {
//       try {
//         const response = await fetch('/api/albums');
//         if (!response.ok) {
//           throw new Error('Failed to fetch albums');
//         }
//         const data: Album[] = await response.json();
//         setAlbums(data);
//         console.log(data);
//       } catch (error) {
//         console.error('Error fetching albums:', error);
//         setAlbums([]); // Set albums to an empty array on error
//       }
//     };

//     fetchAlbums();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 p-10">
//         {/* Check if albums is an array and not empty before mapping */}
//         {Array.isArray(albums) && albums.length > 0 ? (
//           albums.map((album, index) => (
//             <AlbumCard
//               key={index}
//               title={album.title}
//               img={album.urls.length > 0 ? album.urls[0] : '/placeholder.jpg'}
//             />
//           ))
//         ) : (
//           <p>No albums found.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;
import React from 'react'

export default function Home() {
  return (
    <div>Home</div>
  )
}

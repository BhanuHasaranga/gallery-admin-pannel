// // app/album-info/[name].tsx

// import { useRouter } from 'next/router';

// export async function getStaticProps(context: any) {
//   const { name } = context.params; // Destructure 'id' from context.params
//   const albumData = await fetch(`/api/albums/album?name=${name}`); // Use correct API endpoint
//   const album = await albumData.json();

//   return {
//     props: { album },
//   };
// }

// const AlbumInfoPage = ({ album }: { album: any }) => {
//   const router = useRouter();

//   if (!album) {
//     return <p>Album not found</p>;
//   }

//   const { name, description, urls } = album;

//   return (
//     <div>
//       <h1>{name}</h1>
//       <p>{description}</p>
//       <ul>
//         {urls.map((url: string) => (
//           <li key={url}>
//             <img src={url} alt={name} width={200} height={200} />
//           </li>
//         ))}
//       </ul>
//       <button onClick={() => router.back()}>Go Back</button>
//     </div>
//   );
// };

// export default AlbumInfoPage;
import React from 'react'

export default async function AlbumInfo(params: any) {
  const { searchParams } = params;
  const idString = searchParams;
  const id = Number(idString);
  console.log(id);
  const fetchSingleAlbum = async (id: any) => {
    try {
      const response = await fetch(`/api/albums/album?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching albums:", error);
      // Handle error state if needed
    }    
  };
  const albumData = await fetchSingleAlbum(id);
  console.log(albumData);

  return (
    <div>
      <p>albuminfo {id}</p>
    </div>
  )
}

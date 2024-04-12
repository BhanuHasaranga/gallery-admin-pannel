import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { join, dirname } from "path";
import { writeFile, mkdir } from "fs/promises";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const name: string | null = data.get('name') as string;
    const description: string | null = data.get('description') as string;
    const type: string | null = data.get('type') as string;
    const files: FileList | null = data.getAll('files') as unknown as FileList;

    console.log('Album Name:', name);
    console.log('Album Description:', description);
    console.log('Album Type:', type);

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" });
    }

    const urls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
  
      const filePath = join('F:\\tmp', file.name);
      const directoryPath = dirname(filePath);

      try {
        // Create the directory if it doesn't exist
        await mkdir(directoryPath, { recursive: true });
        
        // Write the file to the specified path
        await writeFile(filePath, buffer);
        console.log(`File saved to: ${filePath}`);
  
        // Store the file URL for Prisma
        urls.push({ url: filePath });
      } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json({ success: false, error: "Failed to save file" });
      }
    }

    // Create new album with associated URLs in Prisma
    const newAlbum = await prisma.albums.create({
      data: {
        name,
        description,
        type,
        urls: {
          createMany: {
            data: urls,
          },
        },
      },
      include: {
        urls: true,
      },
    });

    // Respond with a JSON object containing the newly created album and its URLs
    return NextResponse.json({ newAlbum });

  } catch (error) {
    console.log("Error creating album", error);
    return NextResponse.json({
      status: 500,
      message: 'Internal server error',
    });
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const name = searchParams.get('name');

//     if (!name || typeof name !== 'string') {
//       return NextResponse.json({ success: false, error: "Invalid album name" });
//     }

//     const album = await prisma.albums.findFirst({
//       where: {
//         name,
//       },
//       include: {
//         urls: true,
//       },
//     });

//     if (!album) {
//       return NextResponse.json({ success: false, error: "Album not found" });
//     }

//     const { description, type, urls} = album;
//     console.log("urls", urls);

//     return NextResponse.json({
//       name,
//       description,
//       type,
//       urls: urls.map((url: { url: any; }) => url.url), // Extract only the 'url' property
//     });
//   } catch (error) {
//     console.error("Error retrieving album:", error);
//     return NextResponse.json({
//       status: 500,
//       message: 'Internal server error',
//     });
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const albums = await prisma.albums.findMany({
      include: {
        urls: true,
      },
    });

    if (!albums || albums.length === 0) {
      return NextResponse.json({ success: false, error: "No albums found" });
    }

    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      name: album.name,
      description: album.description,
      type: album.type,
      urls: album.urls.map((url) => url.url), // Extract only the 'url' property
    }));

    return NextResponse.json(formattedAlbums);
  } catch (error) {
    console.error("Error retrieving albums:", error);
    return NextResponse.json({
      status: 500,
      message: 'Internal server error',
    });
  }
}

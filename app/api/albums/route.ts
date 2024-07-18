import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { join, dirname } from "path";
import { writeFile, mkdir } from "fs/promises";
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient(); // Initialize Prisma client for database operations

// // Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST'); // Add other allowed methods if needed
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Allow-Credentials', 'true'); // Set this if you need to allow credentials (e.g., cookies)
}

export async function POST(request: NextRequest) {

  try {
    const data = await request.formData();
    const name: string | null = data.get('name') as string;
    const description: string | null = data.get('description') as string;
    const type: string | null = data.get('type') as string;
    const files: FileList | null = data.getAll('files') as unknown as FileList;
    const thumbnails: FileList | null = data.getAll('thumbnail') as unknown as FileList;

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" });
    }
    
    // Adjust the urls array to include both url and thumbnail
    const urls = [];
    
    // Process regular files
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
  
      const uniqueFilename = `${uuidv4()}-${file.name}`;
      const filePath = join('public', 'uploads', uniqueFilename);
      const directoryPath = dirname(filePath);
  
      try {
        await mkdir(directoryPath, { recursive: true });
        await writeFile(filePath, buffer);

        const publicUrl = `http://localhost:3000/uploads/${uniqueFilename}`;

        if (!thumbnails || thumbnails.length === 0) {
          urls.push({ url: publicUrl, thumbnail: null }); // Push both url and thumbnail (set to null for regular files)
        }

        // Process thumbnails
        for (const thumbnail of thumbnails) {
          const bytes = await thumbnail.arrayBuffer();
          const buffer = Buffer.from(bytes);
      
          const uniqueFilename = `${uuidv4()}-${thumbnail.name}`;
          const filePath = join('public', 'thumbnails', uniqueFilename);
          const directoryPath = dirname(filePath);
      
          try {
            await mkdir(directoryPath, { recursive: true });
            await writeFile(filePath, buffer);
    
            const publicThumbnailUrl = `http://localhost:3000/thumbnails/${uniqueFilename}`;
            urls.push({ url: publicUrl, thumbnail: publicThumbnailUrl }); // Push both url (set to null for thumbnails) and thumbnail
      
          } catch (error) {
            console.error('Error saving thumbnail:', error);
            return NextResponse.json({ success: false, error: 'Failed to save thumbnail' });
          }
        }
        // urls.push({ url: publicUrl, thumbnail: null }); // Push both url and thumbnail (set to null for regular files)
  
      } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ success: false, error: 'Failed to save file' });
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
              data: urls.map(url => ({
                url: url.url || '', // Ensure url is never null (replace with a default value if needed)
                thumbnail: url.thumbnail || null,
              })),
            },
          },
        },
        include: {
          urls: true,
        },
    });
    // Respond with a JSON object containing the newly created album and its URLs
    const response = NextResponse.json({ newAlbum });
    setCorsHeaders(response);
    return response;
  } catch (error) {
      console.log("Error creating album", error);
      const response = NextResponse.json({
          status: 500,
          message: 'Internal server error',
      });
      setCorsHeaders(response);
      return response;
  }
}


export async function GET() {
  try {
    const albums = await prisma.albums.findMany({
      where: {
        status: true,
      },
      include: {
        urls: {
          where: {
            status: true,
          },
        },
      },
    });

    if (!albums || albums.length === 0) {
      return NextResponse.json({ success: false, error: "No albums found" });
    }

    // Format retrieved albums data to include necessary information
    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      name: album.name,
      description: album.description,
      type: album.type,
      urls: album.urls.map((url) => ({
        url: url.url,
        thumbnail: url.thumbnail,
      })),
    }));

    // Respond with a JSON object containing formatted album data
    const response = NextResponse.json(formattedAlbums);
    setCorsHeaders(response);
    return response;

  } catch (error) {
    console.error("Error retrieving albums:", error);
    const response = NextResponse.json({
      status: 500,
      message: 'Internal server error',
    });
    setCorsHeaders(response);
    return response;
  }
}
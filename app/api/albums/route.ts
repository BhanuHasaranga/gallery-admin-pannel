import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { join, dirname } from "path";
import { writeFile, mkdir } from "fs/promises";
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient(); // Initialize Prisma client for database operations

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData(); // Extract form data from the incoming request

    const name: string | null = data.get('name') as string;
    const description: string | null = data.get('description') as string;
    const type: string | null = data.get('type') as string;
    const files: FileList | null = data.getAll('files') as unknown as FileList;

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" });
    }

    const urls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
  
      const uniqueFilename = `${uuidv4()}-${file.name}`; // Generate unique filename
      const filePath = join('F:\\tmp', uniqueFilename);
      const directoryPath = dirname(filePath);

      try {
        // Create the directory if it doesn't exist
        await mkdir(directoryPath, { recursive: true });
        
        // Write the file to the specified path
        await writeFile(filePath, buffer);
  
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

    // Format retrieved albums data to include only necessary information
    const formattedAlbums = albums.map((album) => ({
      id: album.id,
      name: album.name,
      description: album.description,
      type: album.type,
      urls: album.urls.map((url) => url.url), // Extract only the 'url' property
    }));

    // Respond with a JSON object containing formatted album data
    return NextResponse.json(formattedAlbums);
  } catch (error) {
    console.error("Error retrieving albums:", error);
    return NextResponse.json({
      status: 500,
      message: 'Internal server error',
    });
  }
}

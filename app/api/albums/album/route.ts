// Import required modules
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { join, dirname } from "path";
import { writeFile, mkdir } from "fs/promises";

// Initialize PrismaClient outside the function scope
const prisma = new PrismaClient();

// Define the GET function
export async function GET(request: NextRequest) {
  try {
    // Parse the URL and retrieve the 'id' parameter
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get('id');
    
    // Check if 'idString' is a valid number
    const id = Number(idString); // Parse string to integer
    console.log("id",id);

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid album id" });
    }

    // Fetch album data from Prisma using the 'id'
    const album = await prisma.albums.findUnique({
      where: {
        id: id,
      },
      include: {
        urls: true,
      },
    });

    if (!album) {
      return NextResponse.json({ success: false, error: "Album not found" });
    }

    // Destructure album properties for response
    const { name, description, type, urls } = album;

    // Map 'urls' to extract 'url' property
    const urlList = urls.map(url => url.url);

    // Return response with album details
    return NextResponse.json({ 
      name,
      description,
      type,
      urls: urlList,
    });

  } catch (error) {
    console.error("Error retrieving album:", error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    });
  }
}

// Export the GET function
export default GET;



// Define the POST function for updating album details
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const albumId = Number(formData.get('id'));

    if (isNaN(albumId)) {
      return NextResponse.json({ success: false, error: "Invalid album id" });
    }

    // Fetch the existing album from the database
    const existingAlbum = await prisma.albums.findUnique({
      where: { id: albumId },
      include: { urls: true },
    });

    if (!existingAlbum) {
      return NextResponse.json({ success: false, error: "Album not found" });
    }

    // Extract form data
    const name = formData.get('name') as string | undefined;
    const description = formData.get('description') as string | undefined;
    const status = formData.get('status') === 'true'; // Convert to boolean

    // Prepare data for updating the album
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (formData.has('status')) {
      updateData.status = status;
    }

    // Update album properties
    const updatedAlbum = await prisma.albums.update({
      where: { id: albumId },
      data: updateData,
    });

    // Process file uploads
    const files = formData.getAll('files') as unknown as FileList;

    if (files.length > 0) {
      const urlsToCreate = [];

      for (const file of Array.from(files)) {
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
          urlsToCreate.push({ url: filePath });
        } catch (error) {
          console.error("Error saving file:", error);
          return NextResponse.json({ success: false, error: "Failed to save file" });
        }
      }

      // Create new URLs in the database
      await prisma.urls.createMany({
        data: urlsToCreate.map(url => ({
          url: url.url,
          albumId: albumId,
        })),
      });
    }

    return NextResponse.json({ success: true, message: "Album updated successfully" });

  } catch (error) {
    console.error("Error updating album:", error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after use
  }
}
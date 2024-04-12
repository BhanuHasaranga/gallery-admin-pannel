// Import required modules
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    const requestBody = await request.json();
    console.log(requestBody);

    const { id, name, description, status, urlsToAdd = [], urlsToUpdate = [] } = requestBody;

    // Validate 'id' as a number
    const albumId = Number(id);
    if (isNaN(albumId)) {
      return NextResponse.json({ success: false, error: "Invalid album id" });
    }

    // Fetch the album from the database
    const existingAlbum = await prisma.albums.findUnique({
      where: {
        id: albumId,
      },
      include: {
        urls: true,
      },
    });

    if (!existingAlbum) {
      return NextResponse.json({ success: false, error: "Album not found" });
    }

    // Prepare data for updating the album
    const updateData = {
      name,
      description,
      status,
    };

    // Update album properties
    const updatedAlbum = await prisma.albums.update({
      where: {
        id: albumId,
      },
      data: updateData,
    });

    // Prepare data for creating new URLs
    const urlsToCreate = urlsToAdd.map(url => ({
      url,
      albumId,
    }));

    // Prepare promises to update existing URLs
    const urlsToUpdatePromises = urlsToUpdate.map(async urlData => {
      const { urlId, url, status } = urlData;
      await prisma.urls.update({
        where: {
          id: urlId,
        },
        data: {
          url,
          status,
        },
      });
    });

    // Execute all database operations in parallel
    await Promise.all([
      // Create new URLs
      prisma.urls.createMany({
        data: urlsToCreate,
      }),
      // Update existing URLs
      ...urlsToUpdatePromises,
    ]);

    return NextResponse.json({ success: true, message: "Album updated successfully" });

  } catch (error) {
    console.error("Error updating album:", error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    });
  }
}

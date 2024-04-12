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

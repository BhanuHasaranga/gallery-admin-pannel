import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Change album status to 0
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract album ID from form data
    const albumId = Number(formData.get("id"));

    // Validate album ID
    if (isNaN(albumId)) {
      return NextResponse.json({ success: false, error: "Invalid album id" });
    }

    // Check if album exists in the database
    const existingAlbum = await prisma.albums.findUnique({
      where: { id: albumId },
      include: { urls: true },
    });

    // Handle album not found
    if (!existingAlbum) {
      return NextResponse.json({ success: false, error: "Album not found" });
    }

    await prisma.albums.update({
      where: { id: albumId },
      data: { status: false },
    });
    console.log(`Album with ID ${albumId} status updated to false.`);
    
    return NextResponse.json({ success: true, message: "Album status updated to false." });
  } catch (error) {
    console.error("Error updating album", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" });
  }
}

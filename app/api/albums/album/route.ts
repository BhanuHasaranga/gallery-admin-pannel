import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join, dirname } from "path";
import { writeFile, mkdir } from "fs/promises";
const { v4: uuidv4 } = require("uuid");

// Initialize Prisma client
const prisma = new PrismaClient();

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST'); // Add other allowed methods if needed
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Allow-Credentials', 'true'); // Set this if you need to allow credentials (e.g., cookies)
}

// GET function to retrieve album details by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get("id");
    const id = Number(idString);

    // Validate album ID
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid album id" });
    }

    // Fetch album data including active URLs
    const album = await prisma.albums.findUnique({
      where: {
        id: id,
      },
      include: {
        urls: {
          where: {
            status: true,
          },
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    // Handle album not found
    if (!album) {
      return NextResponse.json({ success: false, error: "Album not found" });
    }

    // Format and return album details with active URLs
    const { name, description, type, urls } = album;
    const urlsWithIds = urls.map((url) => ({ id: url.id, url: url.url }));

    const response = NextResponse.json({
      id,
      name,
      description,
      type,
      urls: urlsWithIds,
    });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error("Error retrieving album:", error);
    const response = NextResponse.json({
      success: false,
      error: "Internal server error",
    });
    setCorsHeaders(response);
    return response;
  }
}

// POST function to update album details and manage associated URLs
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

    // Prepare data for album update
    const updateData: any = {};

    const name = formData.get("name")?.toString().trim();
    if (name) {
      updateData.name = name;
    }

    const description = formData.get("description")?.toString().trim();
    if (description) {
      updateData.description = description;
    }

    // Update album details in the database
    await prisma.albums.update({
      where: { id: albumId },
      data: updateData,
    });

    // Handle file uploads and create corresponding URLs
    const files = formData.getAll("files") as unknown as File[];
    const thumbnails = formData.getAll("thumbnail") as unknown as File[];
    if (files.length > 0) {
      const urlsToCreate = [];

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueFilename = `${uuidv4()}-${file.name}`; // Generate unique filename
        const filePath = join("public", "uploads", uniqueFilename); // File path relative to project root
        const directoryPath = dirname(filePath);

        try {
          await mkdir(directoryPath, { recursive: true });
          await writeFile(filePath, buffer);
          const publicUrl = `http://localhost:3000/uploads/${uniqueFilename}`;

          if (!thumbnails || thumbnails.length === 0) {
            urlsToCreate.push({ url: publicUrl });
          }

          // Handle thumbnail uploads and create corresponding URLs
          if (thumbnails.length > 0) {
            for (const file of thumbnails) {
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
    
              const uniqueFilename = `${uuidv4()}-${file.name}`; // Generate unique filename
              const filePath = join("public", "thumbnails", uniqueFilename); // File path relative to project root
              const directoryPath = dirname(filePath);
    
              try {
                await mkdir(directoryPath, { recursive: true });
                await writeFile(filePath, buffer);
                const publicThumbnailUrl = `http://localhost:3000/thumbnails/${uniqueFilename}`;
                urlsToCreate.push({ url: publicUrl, thumbnail: publicThumbnailUrl });
              } catch (error) {
                console.error("Error saving thumbnail:", error);
                const response = NextResponse.json({
                  success: false,
                  error: "Failed to save thumbnail",
                });
                setCorsHeaders(response);
                return response;
              }
            }
          }

        } catch (error) {
          console.error("Error saving file:", error);
          const response = NextResponse.json({
            success: false,
            error: "Failed to save file",
          });
          setCorsHeaders(response);
          return response;
        }
      }

      // Create URLs in the database for the uploaded files
      await prisma.urls.createMany({
        data: urlsToCreate.map((url) => ({
          url: url.url || '',
          thumbnail: url.thumbnail || null,
          albumId: albumId,
        })),
      });
    }

    // Handle URL updates (soft-delete) based on provided IDs
    const updatedUrls = formData.getAll("updatedUrlIds") as string[];
    if (updatedUrls.length > 0) {
      const urlIds = updatedUrls
        .flatMap((ids) => ids.split(","))
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      for (const id of urlIds) {
        try {
          await prisma.urls.update({
            where: { id: id },
            data: { status: false },
          });
        } catch (error) {
          console.error(`Error updating URL with ID ${id}:`, error);
        }
      }
    }

    // Respond with success message
    const response = NextResponse.json({
      success: true,
      message: "Album updated successfully",
    });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error("Error updating album:", error);
    const response = NextResponse.json({
      success: false,
      error: "Internal server error",
    });
    setCorsHeaders(response);
    return response;
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after use
  }
}

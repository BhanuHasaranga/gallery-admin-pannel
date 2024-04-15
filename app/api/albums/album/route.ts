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

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid album id" });
    }

    // Fetch album data from Prisma using the 'id', including related URLs with IDs
    const album = await prisma.albums.findUnique({
      where: {
        id: id,
      },
      include: {
        urls: { // Include the 'urls' relation
          select: { // Select specific fields from the 'urls' relation
            id: true, // Include the 'id' field of each URL
            url: true, // Include the 'url' field of each URL
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ success: false, error: "Album not found" });
    }

    // Destructure album properties for response
    const { name, description, type, urls } = album;

    // Return response with album details including URL IDs and URLs
    const urlsWithIds = urls.map(url => ({ id: url.id, url: url.url }));

    return NextResponse.json({
      name,
      description,
      type,
      urls: urlsWithIds, // Return URLs with their IDs
    });

  } catch (error) {
    console.error("Error retrieving album:", error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    });
  }
}


//api/albums/album/routes.tsx
// Define the POST function for updating album details
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const albumId = Number(formData.get('id'));

    if (isNaN(albumId)) {
      return NextResponse.json({ success: false, error: 'Invalid album id' });
    }

    const existingAlbum = await prisma.albums.findUnique({
      where: { id: albumId },
      include: { urls: true },
    });

    if (!existingAlbum) {
      return NextResponse.json({ success: false, error: 'Album not found' });
    }

    const updateData: any = {};

    const name = formData.get('name')?.toString().trim();
    if (name) {
      updateData.name = name;
    }

    const description = formData.get('description')?.toString().trim();
    if (description) {
      updateData.description = description;
    }

    const status = formData.get('status') === 'true';
    updateData.status = status;

    await prisma.albums.update({
      where: { id: albumId },
      data: updateData,
    });

    const files = formData.getAll('files') as unknown as FileList;

    if (files.length > 0) {
      const urlsToCreate = [];

      for (const file of Array.from(files)) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = join('F:\\tmp', file.name);
        const directoryPath = dirname(filePath);

        try {
          await mkdir(directoryPath, { recursive: true });
          await writeFile(filePath, buffer);
          console.log(`File saved to: ${filePath}`);

          urlsToCreate.push({ url: filePath });
        } catch (error) {
          console.error('Error saving file:', error);
          return NextResponse.json({ success: false, error: 'Failed to save file' });
        }
      }

      await prisma.urls.createMany({
        data: urlsToCreate.map(url => ({
          url: url.url,
          albumId: albumId,
        })),
      });
    }

    const updatedUrls = formData.getAll('updatedUrlIds') as string[];

    if (updatedUrls.length > 0) {
      const urlIds = updatedUrls
        .flatMap(ids => ids.split(',')) // Split comma-separated string into an array of IDs
        .map(id => parseInt(id))
        .filter(id => !isNaN(id));
    
      console.log("URL IDs to update:", urlIds);
    
      // Iterate over each URL ID and update its status
      for (const id of urlIds) {
        try {
          // Update the URL status to false (soft-delete)
          const updatedUrl = await prisma.urls.update({
            where: { id: id },
            data: { status: false },
          });
          console.log(`URL with ID ${id} updated successfully:`, updatedUrl);
        } catch (error) {
          console.error(`Error updating URL with ID ${id}:`, error);
          // Handle the error or log it as needed
        }
      }
    
      console.log(`All URLs with IDs [${urlIds.join(', ')}] updated successfully`);
    }
    
    
    // Respond with success message and any relevant data
    return NextResponse.json({ success: true, message: 'Album updated successfully' });

  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });

  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after use
  }
}





// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();

//     const albumId = Number(formData.get('id'));

//     if (isNaN(albumId)) {
//       return NextResponse.json({ success: false, error: 'Invalid album id' });
//     }

//     const existingAlbum = await prisma.albums.findUnique({
//       where: { id: albumId },
//       include: { urls: true },
//     });

//     if (!existingAlbum) {
//       return NextResponse.json({ success: false, error: 'Album not found' });
//     }

//     const name = formData.get('name') as string | undefined;
//     const description = formData.get('description') as string | undefined;
//     const status = formData.get('status') === 'true';

//     const updateData: any = {};

//     if (name !== undefined) {
//       updateData.name = name;
//     }

//     if (description !== undefined) {
//       updateData.description = description;
//     }

//     if (formData.has('status')) {
//       updateData.status = status;
//     }

//     const updatedAlbum = await prisma.albums.update({
//       where: { id: albumId },
//       data: updateData,
//     });

    // const files = formData.getAll('files') as unknown as FileList;

    // if (files.length > 0) {
    //   const urlsToCreate = [];

    //   for (const file of Array.from(files)) {
    //     const bytes = await file.arrayBuffer();
    //     const buffer = Buffer.from(bytes);

    //     const filePath = join('F:\\tmp', file.name);
    //     const directoryPath = dirname(filePath);

    //     try {
    //       await mkdir(directoryPath, { recursive: true });
    //       await writeFile(filePath, buffer);
    //       console.log(`File saved to: ${filePath}`);

    //       urlsToCreate.push({ url: filePath });
    //     } catch (error) {
    //       console.error('Error saving file:', error);
    //       return NextResponse.json({ success: false, error: 'Failed to save file' });
    //     }
    //   }

    //   await prisma.urls.createMany({
    //     data: urlsToCreate.map(url => ({
    //       url: url.url,
    //       albumId: albumId,
    //     })),
    //   });
    // }

//     const updatedUrls = formData.getAll('updatedUrls') as string[];

//     if (updatedUrls.length > 0) {
//       await prisma.urls.updateMany({
//         where: {
//           id: {
//             in: updatedUrls.map(id => parseInt(id)),
//           },
//         },
//         data: { status: false }, // Soft-delete by changing status to false
//       });
//     }

//     return NextResponse.json({ success: true, message: 'Album updated successfully' });
//   } catch (error) {
//     console.error('Error updating album:', error);
//     return NextResponse.json({
//       success: false,
//       error: 'Internal server error',
//     });
//   } finally {
//     await prisma.$disconnect(); // Disconnect Prisma client after use
//   }
// }
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: { json: () => any; }) {

  try {
    const data = await request.json();
    console.log(data);	
    const {name, description} = data

    const newAlbum = await prisma.albums.create({
      data: {
        name,
        description
      }
    });
    return NextResponse.json({newAlbum});

  } catch (error) {
    console.log("Error creating album",error)
    return NextResponse.json({
      status: 500,
      message: 'Internal server error',
    });
  }

}

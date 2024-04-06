import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { useState } from 'react';

const prisma = new PrismaClient();

export async function POST(request: { formData: () => any }) {

  // const [base64Image, setBase64Image] = useState(null);

  try {
    const formData = await request.formData();

    console.log('point1');

    const imageFile = formData.get('imageFile');

    console.log('point2');
    
    
    if (!imageFile) {
      return NextResponse.json({
        status: 400,
        message: 'Missing required field: imageFile',
      });
    }

    console.log('point3');

    const toBase64 = (file: Blob) => {
      console.log('pointA');
      return new Promise((resolve, reject) => {
        console.log('pointB');
        const reader = new FileReader();
        console.log('pointC');
        reader.readAsDataURL(file);
        console.log('pointD');
        reader.onload = () => resolve(reader.result);
        console.log('pointE');
        reader.onerror = (error) => reject(error);
        console.log('pointF');
      });
    };

    console.log('point4');

    const base64 = await toBase64(imageFile);

    console.log('point5');

    const newImage = await prisma.images.create({
        data: {
          base64,
        },
    });

    console.log('point6');

    return NextResponse.json({newImage});

  } catch (error) {
    console.log("Error creating image", error);
    return NextResponse.json({
      status: 500,
      message: 'Internal server error',
    });
  }
}
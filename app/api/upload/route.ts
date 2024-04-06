import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// export async function POST(
    // request: { formData: () => any }
    // ) {

    try {

    let storage = multer.diskStorage({
        destination : function (req, file, cb) {
         cb(null,"/public")
        },
        filename : function (req, file, cb) {
         cb(null, file.fieldname + "_" + Date.now + path.extname(file.originalname))
        },
    });
    
    let upload = multer({ storage: storage });
    
    let uploadFile = upload.single("file");
    
    
        const newFile = await prisma.images.create({
            data: {
                uploadFile
            }
        });
         NextResponse.json({newFile}); 
    
    } catch (error) {
        console.log("Error creating album",error)
         NextResponse.json({
          status: 500,
          message: 'Internal server error',
        });
    }

// }


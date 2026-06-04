import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from 'dotenv'

dotenv.config()
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

export async function addVideoDetailsToDB(title,description,author,url){
    const videoData=await prisma.videoData.create({
        data:{
            title:title,
            description:description,
            author:author,
            url:url
        }
    })

    console.log(videoData)
}


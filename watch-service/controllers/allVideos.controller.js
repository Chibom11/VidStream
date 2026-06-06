import { prisma } from "../db/db.js"

export async function fetchVideo(req,res){
   try {
    const allVids=await prisma.$queryRaw`SELECT * FROM "VideoData"`
    console.log("All Videos",allVids)
    res.status(200).json({"message":"Videosfetched successfully",data:allVids})
    
   } catch (error) {
    console.log("Error while fetching all Videos",error)
    
   }
    
}
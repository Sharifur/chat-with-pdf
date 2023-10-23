//api/create-chat

import { getAwsFileUrl } from "@/lib/aws";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function POST(req: Request, res: Response){

    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({error: `Unautorized`},{status: 401})
    }

    try{
        const body = await req.json();
        const {file_key,file_name} = body;

        await loadS3IntoPinecone(file_key);
        //todo:: create new chat
        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl : getAwsFileUrl(file_key),
            userId
        }).returning({
            insertedId: chats.id
        })

        return NextResponse.json({chat_id : chat_id[0].insertedId},{status: 200});
        
    }catch(error){
        console.log(error);
        return NextResponse.json({
            error: `Internal Server Erroor`,
        },{
            status: 500
        })
    }
}
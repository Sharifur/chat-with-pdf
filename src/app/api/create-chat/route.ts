//api/create-chat

import { NextResponse } from "next/server";



export async function POST(req: Request, res: Response){
    try{
        const body = await req.json();
        const {file_key,file_name} = body;
        return NextResponse.json({
            message: "File Upload Successful"
        })
    }catch(error){
        console.log(error);
        return NextResponse.json({
            error: `Internal Server Erroor`,
        },{
            status: 500
        })
    }
}
import {Pinecone} from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;


export const getPineconeClient = async () => {
    if(!pinecone){
        pinecone = new Pinecone({
            environment: process.env.PINECONE_API_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_VALUE!
        })
    }

    return pinecone;
}


export const loadS3IntoPinecone = async (file_key: String) => {
    //1. obtain pdf-> download and read pdf from s3
}
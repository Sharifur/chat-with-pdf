import {Pinecone} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./aws-server";
import { PDFLoader} from "langchain/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embedding";
import md5 from 'md5';
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";
import { metadata } from "@/app/layout";


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

type PDFPage = {
    pageContent: string;
    metadata : {
        loc: {pageNumber:number}
    }
}

export const loadS3IntoPinecone = async (file_key: string) => {
    //1. obtain pdf-> download and read pdf from s3
    const filename = await downloadFromS3(file_key);

    if(!filename){
        throw new Error('File not found');
    }

    //todo get data from pdf using lanchain
    const loader = new PDFLoader(filename);
    const pages = (await loader.load()) as PDFPage[];

    //2. slit and segment the docs

    const documents = await Promise.all(pages.map(page => prepareDocument(page)));

    //3. vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(doc => embedDocument(doc)))
    //4. upload to pinecode
    
    
}

//asunc function embedDocument
async function embedDocument(doc: Document){
    try{
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata : {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as Vector;

    }catch(error){
        console.log('error embedding document',error);
        throw error;
    }
}


export const truncateStringByByte = (str: string,  bytes: number) => {
    const enc = new TextEncoder();

    return new TextDecoder('utf-8').decode(enc.encode(str)).slice(0,bytes);
}

async function prepareDocument(page:PDFPage){
    let {pageContent,metadata} = page;
    pageContent = pageContent.replace(/\n/g,'');

    //split the docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByByte(pageContent,36000)
            }
        })
    ]);

    return docs;
}
import {OpenAIApi,Configuration} from 'openai-edge';


const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

export async function getEmbeddings(text:string){
    try{
          
    }catch(error){
        console.log('error calling openai embeddings api',error);
        throw error;
    }
}
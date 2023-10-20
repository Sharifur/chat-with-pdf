import AWS from 'aws-sdk';
import fs from "fs";


export const downloadFromS3 = async (file_key: string) => {
    try{

        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_API_KEY,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
        });


        //todo:: write function to upload to aws
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET
            },
            region : process.env.NEXT_PUBLIC_AWS_S3_REGION
        })

        //todo:: create file name
        const file_name = "tmp/" +  Date.now().toString()+'.pdf';
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
            Key: file_key
        }

        const obj = await s3.getObject(params).promise();



    }catch(error){
        console.log(error);
        return null;
    }
}
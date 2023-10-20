import AWS from "aws-sdk";


export async function  uploadToS3(file: File){
    try{
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_API_KEY,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
        });


        //todo:: write function to upload to aws
        const aws = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET
            },
            region : process.env.NEXT_PUBLIC_AWS_S3_REGION
        })

        //todo:: create file name
        const file_name = "uploads/" +  Date.now().toString() + file.name.replace(" ","-");
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
            Key: file_name,
            Body: file
        }
        // console.log(process.env.NEXT_PUBLIC_AWS_S3_BUCKET);
        const upload = aws.putObject(params).on('httpUploadProgress', evt => {
            console.log(`upload file progress`,parseInt( ((evt.loaded * 100 ) / evt.total).toString() ))
        }).promise();

       await upload.then((data) => {
            console.log(`file upload complete ${file_name}`);
       })

       return Promise.resolve({
        file_key : file_name,
        file_name : file.name
       })

    }catch(error){
        console.log('eerrr',error);
        // throw new Error(error);
    }
}

export const getAwsFileUrl= (file_key : String)  => {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${file_key}`;

    return url;
}
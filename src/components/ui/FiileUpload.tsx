"use client";

import { uploadToS3 } from "@/lib/aws";
import { Inbox } from "lucide-react";
import React, {useCallback} from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {




    const {getRootProps,getInputProps,isDragActive} = useDropzone({
        accept: {"application/pdf" : ['.pdf']},
        onDrop: async (acceptedFiles) => {

            const file = acceptedFiles[0];

            if(file.size > 10 * 1024 * 1024){
                alert("upload file less than 10MB");
                return;
            }


            try{
                const uploadedFile = await uploadToS3(file);
                console.log('data', uploadedFile);
            }catch(error){

            }

            console.log(acceptedFiles);
        }
    });

    return (
        <div className="p-2 bg-white rounded-xl">
            <div {
                ...getRootProps({
                    className : "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
                })
            }>
                <input {...getInputProps()} />
                <Inbox
                className="w10 h10 text-blue-500"
                />
                <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
            </div>
        </div>
    )
}

export default FileUpload;
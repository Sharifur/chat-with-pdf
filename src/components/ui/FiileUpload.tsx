"use client";

import { uploadToS3 } from "@/lib/aws";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, {useCallback, useState} from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {

    const router = useRouter();

    const [uploading,setUploading] = useState(false);

    const {mutate,isLoading} = useMutation({
        mutationFn :async ({file_key,file_name} : {file_key : String, file_name: String}) => {
           
            const response = axios.post('api/create-chat',{
                file_key,file_name
            })

            return (await response).data;
            
        }
    });

    const {getRootProps,getInputProps,isDragActive} = useDropzone({

        accept: {"application/pdf" : ['.pdf']},
        onDrop: async (acceptedFiles) => {
            setUploading(true);
            const file = acceptedFiles[0];

            if(file.size > 10 * 1024 * 1024){
                toast.error("upload file less than 10MB");
                return;
            }


            try{
                const data = await uploadToS3(file);
                
                if(!data?.file_key || !data?.file_name){
                    toast.error("Something Went Wrong!!");
                    return;
                }

                mutate(data,{
                    onSuccess: ({chat_id}) => {
                        //todo:: redirect user to chat page
                        toast.success(`Chat has been created`);
                        router.push(`'/chat/${chat_id}`);

                    },
                    onError: (error) => {
                        toast.error("Error Creating Chat");
                        console.log(error)
                    }
                });
            }catch(error){

            } finally{
                setUploading(false)
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
                
                {uploading || isLoading ? (
                    <>
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">Uploading PDF.....</p>
                    </>
                ) : (
                    <> 
                    <Inbox className="w10 h10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </> 
                )
                }
               

            </div>
        </div>
    )
}

export default FileUpload;
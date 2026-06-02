"use client"

import React, { useState } from 'react'
import axios from 'axios'


const UploadForm = () => {

    const [selectedFile, setSelectedFile] = useState();

    const handleUpload = async (e) => {

        e.preventDefault();
        const formdata=new FormData();
        formdata.append('filename',selectedFile.name)
        try {
    
                const initializeRes = await axios.post(
                    'http://localhost:3030/upload/initialize',
                    formdata,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
    
                const {uploadId}= initializeRes.data;
                console.log("Upload Id",uploadId);

                const chunksize=5*1024*1024; //5mb
                const totalsize=Math.ceil(selectedFile.size);

                const totalChunks=totalsize/chunksize;

                let start=0;
                let uploadedPromises=[];
                for(let i=0;i<totalChunks;i++){
                    const currentChunk=selectedFile.slice(start,start+chunksize);
                    start+=chunksize;
                    const chunkFormdata=new FormData();
                    chunkFormdata.append('filename',selectedFile.name)
                    chunkFormdata.append('chunk',currentChunk);
                    chunkFormdata.append('totalchunks',totalChunks)
                    chunkFormdata.append('chunkIndex',i);
                    chunkFormdata.append('uploadId',uploadId);

                    /////////////////////////   chunking   ////////////////////////
                     const uploadedPromise=axios.post('http://localhost:3030/upload',chunkFormdata,{headers:{'Content-Type':'multipart/form-data'}})
                    uploadedPromises.push(uploadedPromise)       
                }
                await Promise.all(uploadedPromises);

                    ///////////////////////////   completion   //////////////////////////
                        const completeRes= await axios.post('http://localhost:3030/upload/complete',{
                            filename:selectedFile.name,
                            totalChunks:totalChunks,
                            uploadId:uploadId
                        })

                        console.log(completeRes.data);

            } 
        catch (error) {
    
                console.log("Error uploading", error);
    
            }
        
        }

       


    return (
        <div>
            <form>

                <label>Select Video</label>

                <input
                    type="file"
                    accept=".pdf,video/mp4,image/jpeg"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                <button onClick={handleUpload}>
                    Upload Video
                </button>

            </form>
        </div>
    )
}

export default UploadForm;
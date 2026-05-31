"use client"

import React, { useState } from 'react'
import axios from 'axios'

const UploadForm = () => {

    const [selectedFile, setSelectedFile] = useState();

    const handleUpload = async (e) => {

        e.preventDefault();

        const chunksize=100*1024*1024;//100 mb chunks
        const totalchunks=Math.ceil(selectedFile.size/chunksize);

        console.log(totalchunks);
        let start=0;

        for(let chunkIndex=0;chunkIndex<totalchunks;chunkIndex++){
            const chunk=selectedFile.slice(start,start+chunksize);
            start+=chunksize;
            const formdata = new FormData();
            formdata.append('filename', selectedFile.name);
            formdata.append('chunk',chunk)
            formdata.append('totalchunks',totalchunks)
            formdata.append('currentchunk',chunkIndex+1)
            
            try {
    
                const res = await axios.post(
                    'http://localhost:3030/upload',
                    formdata,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
    
                console.log(res.data);
    
            } catch (error) {
    
                console.log("Error uploading", error);
    
            }
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
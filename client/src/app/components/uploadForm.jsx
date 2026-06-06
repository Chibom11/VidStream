"use client"

import React, { useState } from 'react'
import axios from 'axios'


const UploadForm = () => {

    const [selectedFile, setSelectedFile] = useState();
    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const handleUpload = async (e) => {

        e.preventDefault();
        const formdata = new FormData();
        formdata.append('filename', selectedFile.name)
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

            const { uploadId } = initializeRes.data;
            console.log("Upload Id", uploadId);

            /////////////////////////   chunking   ////////////////////////
            const chunksize = 5 * 1024 * 1024; //5mb
            const totalsize = Math.ceil(selectedFile.size);

            const totalChunks = totalsize / chunksize;

            let start = 0;
            let uploadedPromises = [];
            for (let i = 0; i < totalChunks; i++) {
                const currentChunk = selectedFile.slice(start, start + chunksize);
                start += chunksize;
                const chunkFormdata = new FormData();
                chunkFormdata.append('filename', selectedFile.name)
                chunkFormdata.append('chunk', currentChunk);
                chunkFormdata.append('totalchunks', totalChunks)
                chunkFormdata.append('chunkIndex', i);
                chunkFormdata.append('uploadId', uploadId);

                const uploadedPromise = axios.post('http://localhost:3030/upload', chunkFormdata, { headers: { 'Content-Type': 'multipart/form-data' } })
                uploadedPromises.push(uploadedPromise)
            }
            await Promise.all(uploadedPromises);

            ///////////////////////////   completion   //////////////////////////
            const completeRes = await axios.post('http://localhost:3030/upload/complete', {
                filename: selectedFile.name,
                totalChunks: totalChunks,
                uploadId: uploadId,
                author: author,
                description: description,
                title: title
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

                <label>Author</label>
                <input type='text' value={author} onChange={(e) => (setAuthor(e.target.value))} />

                <label>Title</label>
                <input type='text' value={title} onChange={(e) => (setTitle(e.target.value))} />

                <label>Description</label>
                <input type='text' value={description} onChange={(e) => (setDescription(e.target.value))} />


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
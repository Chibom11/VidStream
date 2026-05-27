"use client"

import React, { useState } from 'react'
import axios from 'axios'

const UploadForm = () => {

    const [selectedFile, setSelectedFile] = useState();

    const handleUpload = async (e) => {

        e.preventDefault();

        const formdata = new FormData();
        formdata.append('file', selectedFile);

        try {

            const res = await axios.post(
                'http://localhost:3030/api/upload',
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
'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

function HomePage() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:3032/fetchAll')
        setVideos(res.data.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div>
      {videos.map((video) => (
        <div key={video.id}>
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          <p>By: {video.author}</p>

          <video width="500" controls>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  )
}

export default HomePage
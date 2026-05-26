"use client"
import React, { useRef, useState } from 'react'

const Room = () => {
  const videoRef = useRef(null)
  const [streaming, setStreaming] = useState(false)
  const streamRef = useRef(null)

  const startStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    streamRef.current = stream
    if (videoRef.current) {
      videoRef.current.srcObject = stream  // assign to srcObject, not src/url
      videoRef.current.play()
    }
    setStreaming(true)
  }

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setStreaming(false)
  }

  return (
    <div>
      <video ref={videoRef} width={1280} height={720} muted autoPlay playsInline />
      <button onClick={streaming ? stopStream : startStream}>
        {streaming ? 'Stop' : 'Start Camera'}
      </button>
    </div>
  )
}

export default Room
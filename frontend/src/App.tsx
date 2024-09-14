import { BrowserRouter } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import 'regenerator-runtime/runtime';


import './App.css'
import Dictaphone from '@components/Dictaphone'

function App() {
    // const [isRecording, setIsRecording] = useState<boolean>(false);
    // const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    // const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    // // react-speech-recognition hook
    // const {
    //     transcript,
    //     listening,
    //     resetTranscript,
    //     browserSupportsSpeechRecognition,
    //   } = useSpeechRecognition()
    
    // useEffect(() => {
    //     SpeechRecognition.startListening( { continuous: true })
    //     // detect keyword "key kevin"
    //     if (transcript.toLowerCase().includes('hey kevin')) {
    //         startRecording()
    //         resetTranscript()
    //     }

    //     return () => {
    //         SpeechRecognition.stopListening()
    //     }
    // }, [transcript])

    useEffect(() => {
        document.title = 'Frontend Kevin'
    }, [])

    // const startRecording = async () => {
    //     if (isRecording || mediaRecorder) return

    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    //         setMediaStream(stream)

    //         const recorder = new MediaRecorder(stream)
    //         setMediaRecorder(recorder)

    //         recorder.start()
    //         setIsRecording(true)
    //         console.log('Recording started')

    //         recorder.ondataavailable = (event: BlobEvent) => {
    //             setAudioChunks((prev) => [...prev, event.data])
    //         }

    //         recorder.onstop = () => {
    //             console.log('Recording stopped')
    //             const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    //             const audioUrl = window.URL.createObjectURL(audioBlob)
    //             const audio = new Audio(audioUrl)
    //             audio.play()

    //             // clean up the media recorder and stream
    //             if (mediaStream) {
    //                 mediaStream.getTracks().forEach((track) => track.stop())
    //             }
    //             setMediaStream(null)
    //             setMediaRecorder(null)
    //             setIsRecording(false)
    //             setAudioChunks([])
    //         }

    //         // stop recording after a period of silence
    //         handlePauseDetection(recorder)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // const handlePauseDetection = (recorder: MediaRecorder) => {
    //     let silenceTimeout: NodeJS.Timeout
    
    //     recorder.ondataavailable = (event: BlobEvent) => {
    //       setAudioChunks((prevChunks) => [...prevChunks, event.data]);
    
    //       clearTimeout(silenceTimeout)
    
    //       // Stop recording after 3 seconds of silence
    //       silenceTimeout = setTimeout(() => {
    //         stopRecording();
    //       }, 3000) // Adjust the time as needed
    //     }
    //   }

    //   const stopRecording = () => {
    //     if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    //       mediaRecorder.stop()
    //     }
    //   }
    return (
        // <BrowserRouter basename='/'>
        //     <Navbar />
        //     <Routes />
        // </BrowserRouter>
        <Dictaphone />
    )
}

export default App

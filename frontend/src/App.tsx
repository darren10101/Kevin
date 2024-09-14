import { BrowserRouter } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime';
import './App.css'
import Dictaphone from '@components/Dictaphone'
import useSpeechRecognition from './hooks/useSpeechRecognitionHook';

function App() {
    const {
        isListening,
        capturedText,
        startListening,
        stopListening,
        hasRecognitionSupport,
    } = useSpeechRecognition()

    if (!hasRecognitionSupport) {
        return <span>Speech Recognition Not Supported</span>
    }

    useEffect(() => {
        document.title = 'Frontend Kevin'
    }, [])

    return (
        // <BrowserRouter basename='/'>
        //     <Navbar />
        //     <Routes />
        // </BrowserRouter>
        <div>
            <h1>Speech Recognition Demo</h1>
            <p>{isListening ? 'Listening...' : 'Not Listening'}</p>
            <h2>Captured Text:</h2>
            <p>{capturedText}</p>
        </div>
    )
}

export default App

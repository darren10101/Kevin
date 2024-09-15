import { useEffect, useState } from 'react';

let recognition: any = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
}

const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [capturedText, setCapturedText] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [isRecognitionActive, setIsRecognitionActive] = useState(false); // To prevent multiple starts

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');

            console.log('transcript: ', transcript);

            // Start capturing when "hey kevin" is detected
            if (transcript.toLowerCase().includes('hey kevin')) {
                setIsCapturing(true);
                setCapturedText(''); // Reset captured text
                console.log('CAPTURING STARTED');
            }

            // Stop capturing when "thanks kevin" is detected
            if (transcript.toLowerCase().includes('thanks kevin')) {
                setIsCapturing(false);
                console.log('CAPTURING ENDED. Final Captured Text:', capturedText);
            }

            // If capturing is enabled, append the transcript to capturedText
            if (isCapturing) {
                setCapturedText((prev) => prev + ' ' + transcript);
            }
        };

        recognition.onend = () => {
            console.log('recognition ended');
            setIsRecognitionActive(false); // Mark recognition as stopped
            if (isListening) {
                startRecognition(); // Restart listening
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.log('recognition error: ', event);
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                setIsListening(false);
                recognition.stop();
                setIsRecognitionActive(false); // Mark recognition as stopped
                console.log('recognition stopped due to error');
            }
        };

        startListening(); // Start listening initially

        return () => {
            stopListening();
        };
    }, [isListening, isCapturing]);

    const startRecognition = () => {
        if (!isRecognitionActive) {
            try {
                recognition.start();
                setIsRecognitionActive(true); // Mark recognition as started
            } catch (error) {
                console.error('Error starting recognition: ', error);
            }
        }
    };

    const startListening = () => {
        if (!isListening) {
            setIsListening(true);
            startRecognition();
        }
    };

    const stopListening = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
            setIsRecognitionActive(false); // Mark recognition as stopped
        }
    };

    return {
        capturedText,
        isListening,
        isCapturing,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;
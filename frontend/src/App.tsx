import React, { useEffect, useState, useRef} from "react";

const App: React.FC = () => {
    const [transcript, setTranscript] = useState<string>("")
    const [listening, setListening] = useState<boolean>(false)
    const [isCapturing, setIsCapturing] = useState<boolean>(false)
    const [capturedText, setCapturedText] = useState<string>('')
    const isCapturingRef = useRef(isCapturing)
    const listeningRef = useRef(listening)

    // SpeechRecognition instance, defined as optional since not all browsers support it
    let recognition: SpeechRecognition | null = null;


    useEffect(() => {
        isCapturingRef.current = isCapturing
        console.log("CAPTURE REF----", isCapturingRef.current)
        listeningRef.current = listening
        if (!listeningRef.current) {
            recognition?.stop()
        }
        if (!isCapturingRef.current) {
            console.log(transcript)
        }
    }, [isCapturing, listening])

    // Initialize the speech recognition object
    const initializeRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition. Try using Chrome.");
            return;
        }

        // Create a new instance of SpeechRecognition
        recognition = new SpeechRecognition();
        if (!recognition) {
            alert("Failed to initialize Speech Recognition");
            return;
        }
        recognition.continuous = true; // Keep listening continuously
        recognition.interimResults = true; // Show results in real-time
        recognition.lang = "en-US"; // Set the language for speech recognition

        // Handle the result event when speech is recognized
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = ''
            // Iterate over the speech results
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript.toLowerCase().trim()

                if (transcriptPiece.includes("hey kevin")) {
                    setIsCapturing(true)
                } else if (transcriptPiece.includes("thanks kevin")) {
                    setIsCapturing(false)
                }
                if (isCapturingRef.current) {
                    if (event.results[i].isFinal) {
                        setTranscript((prevTranscript) => prevTranscript + transcriptPiece + " ");
                    } else {
                        interimTranscript += transcriptPiece;
                    }
                }
            }
            console.log("Interim transcript: ", interimTranscript)
        };

        // Restart recognition in case it stops automatically
        recognition.onend = () => {
            if (listening) {
                recognition?.start(); // Restart listening if the user wants it to keep going
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error: ", event.error);
        };
    };

    // Start listening function
    const startListening = () => {
        setListening(true);
        setTranscript("");
        recognition?.start();
    };

    // Stop listening function
    const stopListening = () => {
        setListening(false);
        setTranscript("");
        recognition?.stop();
    }

    // Initialize the SpeechRecognition API when the component mounts
    useEffect(() => {
        initializeRecognition();

        return () => {
            // Clean up: stop recognition when the component is unmounted
            stopListening();
        };
    }, []);

    return (
        <div>
            <h1>Voice Listener</h1>
            <p>Say something, I am listening!</p>
            <div>
                <strong>Transcript:</strong> {transcript}
            </div>
            <button onClick={startListening} disabled={listening}>
                Start Listening
            </button>
            <button onClick={stopListening} disabled={!listening}>
                Stop Listening
            </button>
        </div>
    );
};

export default App;
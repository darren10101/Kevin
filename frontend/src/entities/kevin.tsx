import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"

const Kevin = forwardRef((props, ref) => {

    // ==================== Voice Recognition ====================
    const [transcript, setTranscript] = useState<string>("")
    const [listening, setListening] = useState<boolean>(false)
    const [isCapturing, setIsCapturing] = useState<boolean>(false)
    const isCapturingRef = useRef(isCapturing)
    const listeningRef = useRef(listening)

    // SpeechRecognition instance, defined as optional since not all browsers support it
    let recognition: SpeechRecognition | null = null

    useEffect(() => {
        isCapturingRef.current = isCapturing
        console.log("CAPTURE REF----", isCapturingRef.current)
        console.log(transcript)
        // TODO: add api calls here
        if (!listeningRef.current) {
            recognition?.stop()
        }
    }, [isCapturing])
    useEffect(() => {
        listeningRef.current = listening
        console.log("LISTENING REF----", listeningRef.current)
        if (!listeningRef.current) {
            return
        }
    }, [listening])

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
    const toggleListening = () => {
        console.log("toggled")
        if (listeningRef.current) {
            setListening(false);
            recognition?.stop();
        } else {
            setListening(true);
            setTranscript("");
            initializeRecognition()
            if (!recognition) {
                alert("Failed to initialize Speech Recognition");
                return;
            }
            recognition.start();
        }
    };
    useImperativeHandle(ref, () => ({
        toggleListening
    }));
    // Initialize the SpeechRecognition API when the component mounts
    return (
        <div>
            <h1>Kevin</h1>
            <p>transcript: {transcript}</p>
        </div>
    )
})

export default Kevin;
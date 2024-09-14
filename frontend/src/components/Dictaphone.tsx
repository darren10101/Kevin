import useSpeechRecognition from '../hooks/useSpeechRecognitionHook'

const Dictaphone = () => {
    const {
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport,
    } = useSpeechRecognition()

    return (
        <div>
            {hasRecognitionSupport ? (
                <>
                    <div>
                        <button onClick={startListening} disabled={isListening}>
                            Start Listening
                        </button>
                    </div>
                    <div>
                        <button onClick={stopListening} disabled={!isListening}>
                            Stop Listening
                        </button>
                    </div>

                    {isListening ? <div>listening</div> : null}
                    
                </>) : (
                <span>Speech Recognition Not Supported</span>
            )}
        </div>
    )
}

export default Dictaphone
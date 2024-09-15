import { useState, useRef, useEffect, useContext } from "react";
import Editor from "@components/Editor";
import styles from "./Home.module.scss";
import { KevinContext } from "../contexts/KevinContext";
import process from "process";
import axios from "axios";

//screenshot variables
//import html2canvas from "html2canvas";

declare global {
  interface Window {
    html2canvas: any; // Declare html2canvas as part of window
  }
}

const Home = () => {
  const [html, setHTML] = useState("");
  const [css, setCSS] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);


  const getAudioFromText = async (text: string) => {
    setLoading(true);

    try {
      // Send POST request to Flask API
      const response = await fetch("http://127.0.0.1:5000/tts/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }), // Send the text as JSON
      });

      // Check if the response is successful
      if (response.ok) {
        // Get the audio data as a blob
        const audioBlob = await response.blob();

        // Create a URL for the blob
        const audioUrl = window.URL.createObjectURL(audioBlob);

        // Create an audio element and play the audio
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error("Error generating audio:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading spinner or status
    }
  };

  const injectHtml2Canvas = async () => {
    if (previewRef.current && previewRef.current.contentWindow) {
      const iframeWindow = previewRef.current.contentWindow;
      const iframeDocument = previewRef.current.contentDocument;

      // Check if the iframe document is accessible (same-origin)
      if (iframeDocument) {
        // Inject the html2canvas script if it's not already loaded in the iframe
        const script = iframeDocument.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = () => {
          console.log("html2canvas loaded in iframe.");

          // Execute html2canvas inside the iframe
          iframeWindow
            .html2canvas(iframeDocument.body)
            .then((canvas: HTMLCanvasElement) => {
              const imgData = canvas.toDataURL("image/png");
              console.log("Screenshot captured:");

              return imgData;

              // You can now download the image or process it further
              const link = document.createElement("a");
              link.href = imgData;
              link.download = "screenshot.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
        };

        // Append the script to the iframe's head or body
        iframeDocument.head.appendChild(script);
      } else {
        console.error("Unable to access iframe document.");
      }
    } else {
      console.error("Iframe not loaded or not accessible.");
    }
  };


  const handleGenerateAudio = () => {
    const text = ""; // Example text
    getAudioFromText(text);
  };

  const handleImageDescription = async () => {
    const imageData = await injectHtml2Canvas();
    try {
      const imageDescription = await axios.post(
        "http://127.0.0.1:5000/llm/describe",
        { image: imageData }
      );
      await getAudioFromText(imageDescription.data.result);
    } catch (e) {
      console.log("server error");
    }
  };


  return (
    <main className={styles.main}>
      <div className={styles.editor}>
        <h3>HTML</h3>
        <div>
          <Editor lang="html" code={html} onChange={setHTML} />
        </div>
      </div>
      <div className={styles.editor}>
        <h3>CSS </h3>
        <div>
          <Editor lang="css" code={css} onChange={setCSS} />
        </div>
      </div>
      <div className={fullscreen ? styles.fullscreen : styles.preview}>
       
        <iframe
          srcDoc={`
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>
              ${html}
            </body>
          </html>
            
        `}
          ref={previewRef}
        />
        <svg
          height="80px"
          width="80px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setFullscreen(!fullscreen)}
          viewBox="0 0 384.97 384.97"
        >
          <g>
            <g id="Fullscreen_1_">
              <path
                d="M372.939,216.545c-6.123,0-12.03,5.269-12.03,12.03v132.333H24.061V24.061h132.333c6.388,0,12.03-5.642,12.03-12.03
            S162.409,0,156.394,0H24.061C10.767,0,0,10.767,0,24.061v336.848c0,13.293,10.767,24.061,24.061,24.061h336.848
            c13.293,0,24.061-10.767,24.061-24.061V228.395C384.97,221.731,380.085,216.545,372.939,216.545z"
              />
              <path
                d="M372.939,0H252.636c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h91.382L99.635,268.432
            c-4.668,4.668-4.668,12.235,0,16.903c4.668,4.668,12.235,4.668,16.891,0L360.909,40.951v91.382c0,6.641,5.39,12.03,12.03,12.03
            s12.03-5.39,12.03-12.03V12.03l0,0C384.97,5.558,379.412,0,372.939,0z"
              />
            </g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </g>
        </svg>
      </div>
    </main>
  );
};

export default Home;

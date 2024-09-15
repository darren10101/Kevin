import { useEffect, useState, useContext, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Editor from '@components/Editor'
import styles from './Home.module.scss'
import { KevinContext } from '../contexts/KevinContext'
import axios from 'axios'

declare global {
    interface Window {
      html2canvas: any; // Declare html2canvas as part of window
    }
}

const Document = () => {
  const { htmlString, setHtmlString, cssString, setCssString, nameString, setNameString } = useContext(KevinContext);
  const [fullscreen, setFullscreen] = useState(false);
  const [searchParams] = useSearchParams();
  const [oid, setOid] = useState('');
  const id = searchParams.get('id');
  
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
            .then(async(canvas: HTMLCanvasElement) => {
              let imgData = canvas.toDataURL("image/png");
              imgData = imgData.replace(/^data:image\/(png|jpg);base64,/, "");
              console.log(imgData);
              try {
                const imageDescription = await axios.post(
                  "http://127.0.0.1:5000/llm/describe",
                  { image: imgData }
                );
                await getAudioFromText(imageDescription.data.result);
              } catch (e) {
                console.log("server error");
              }
              console.log("Screenshot captured:");
            
              // You can now download the image or process it further
            //   const link = document.createElement("a");
            //   link.href = imgData;
            //   link.download = "screenshot.png";
            //   document.body.appendChild(link);
            //   link.click();
            //   document.body.removeChild(link);
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
    const text = "this is a test"; // Example text
    getAudioFromText(text);
  };

  useEffect(() => {
    const getProject = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user/get-program/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        const projectKey = Object.keys(data)[0];
        const projectData = data[projectKey];

        setOid(projectKey);
        setHtmlString(projectData.html);
        setCssString(projectData.css);
        setNameString(projectData.name);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    getProject();
  }, [id, setHtmlString, setCssString, setNameString]);

  const saveProject = async () => {
    const params = {
      name: nameString,
      html: htmlString,
      css: cssString,
      id: id,
      oid: oid,
    };

    try {
      console.log(params);
      const response = await axios.post('http://127.0.0.1:5000/user/update-program', params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        console.log('Project saved');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleKeyDown = (event: any) => {
    const code = event.which || event.keyCode;
    const charCode = String.fromCharCode(code).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      saveProject();
      alert('Project Saved');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

 


  
  return <>
  <div className={styles.describe} onClick = {injectHtml2Canvas}>
    Describe with Kevin
  </div>
  <main className={styles.main}>
    <div className={styles.editor}>
      <h3>HTML</h3>
      <div>
        <Editor lang='html' code={htmlString} onChange={setHtmlString} />
      </div>
    </div>
    <div className={styles.editor}>
      <h3>CSS</h3>
      <div>
        <Editor lang='css' code={cssString} onChange={setCssString} />
      </div>
    </div>
    <div className={fullscreen?styles.fullscreen:styles.preview}>
      <iframe
        srcDoc={`
          <html>
            <head>
              <style>${cssString}</style>
            </head>
            <body>
              ${htmlString}
            </body>
          </html>
        `}
        ref = {previewRef}
      />
      <svg height="80px" width="80px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
        onClick={() => setFullscreen(!fullscreen)}
        viewBox="0 0 384.97 384.97">
      <g>
        <g id="Fullscreen_1_">
          <path d="M372.939,216.545c-6.123,0-12.03,5.269-12.03,12.03v132.333H24.061V24.061h132.333c6.388,0,12.03-5.642,12.03-12.03
            S162.409,0,156.394,0H24.061C10.767,0,0,10.767,0,24.061v336.848c0,13.293,10.767,24.061,24.061,24.061h336.848
            c13.293,0,24.061-10.767,24.061-24.061V228.395C384.97,221.731,380.085,216.545,372.939,216.545z"/>
          <path d="M372.939,0H252.636c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h91.382L99.635,268.432
            c-4.668,4.668-4.668,12.235,0,16.903c4.668,4.668,12.235,4.668,16.891,0L360.909,40.951v91.382c0,6.641,5.39,12.03,12.03,12.03
            s12.03-5.39,12.03-12.03V12.03l0,0C384.97,5.558,379.412,0,372.939,0z"/>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
      </g>
      </svg>
    </div>
  </main>
  </>;
}

export default Document;
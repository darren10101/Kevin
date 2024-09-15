import { useState, useRef, useEffect } from "react";
import Editor from "@components/Editor";
import styles from "./Home.module.scss";

//screenshot variables
import html2canvas from "html2canvas";

declare global {
  interface Window {
    html2canvas: any; // Declare html2canvas as part of window
  }
}

export const Home = () => {
  const [html, setHTML] = useState("");
  const [css, setCSS] = useState("");

  const previewRef = useRef<HTMLIFrameElement>(null);

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
              console.log("Screenshot captured:", imgData);

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

  return (
    <main className={styles.main}>
      <div className={styles.editor}>
        <h3>HTML</h3>
        <div>
          <Editor lang="html" code={html} onChange={setHTML} />
        </div>
      </div>
      <div className={styles.editor}>
        <h3>CSS</h3>
        <div>
          <Editor lang="css" code={css} onChange={setCSS} />
        </div>
      </div>

      <div className={styles.preview}>
        <button onClick={injectHtml2Canvas}>Screenshot</button>
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
      </div>
    </main>
  );
};

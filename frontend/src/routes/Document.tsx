import { useState } from 'react'
import Editor from '@components/Editor'
import styles from './Home.module.scss'

const Document = () => {
  const [html, setHTML] = useState('')
  const [css, setCSS] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  return <main className={styles.main}>
    <div className={styles.editor}>
      <h3>HTML</h3>
      <div>
        <Editor lang='html' code={html} onChange={setHTML} />
      </div>
    </div>
    <div className={styles.editor}>
      <h3>CSS</h3>
      <div>
        <Editor lang='css' code={css} onChange={setCSS} />
      </div>
    </div>
    <div className={fullscreen?styles.fullscreen:styles.preview}>
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
  </main>;
}

export default Document;
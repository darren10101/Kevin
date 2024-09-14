import { useState } from 'react'
import Editor from '@components/Editor'
import styles from './Home.module.scss'

export const Home = () => {
  const [html, setHTML] = useState('')
  const [css, setCSS] = useState('')
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
    <div className={styles.preview}>
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
    </div>
  </main>;
}
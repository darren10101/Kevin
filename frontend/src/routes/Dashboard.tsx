import { useState, useEffect } from 'react'
import styles from './Dashboard.module.scss'

interface Project {
    cssRaw: string;
    htmlRaw: string;
    title: string;
    user_id: string;
}

export const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/user/get-projects')
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div className={styles.dashboard}>
            <h1>Dashboard</h1>
            <div className={styles.projects}>
                {projects.map((project, index) => {
                    return (
                        <div key={index} className={styles.project}>
                            <h3>{project.title}</h3>
                            <iframe
                                srcDoc={`
                                    <html>
                                        <head>
                                            <style>${project.cssRaw}</style>
                                        </head>
                                        <body>
                                            ${project.htmlRaw}
                                        </body>
                                    </html>
                                `}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react'
import styles from './Dashboard.module.scss'
import { Typewriter } from '@components/Typewriter';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProjectDetails {
    css: string;
    html: string;
    name: string;
    user_id: string;
}

interface Project {
    [key: string]: ProjectDetails;
}

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const getProjects = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/user/get-programs', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                setProjects(response.data);
            }
            catch(error){
                console.log(error)
            }
        };
        const getUser = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:5000/user/get-user', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.log(response.data);
            setUser(response.data);
          } catch (error) {
            console.error('Error getting user:', error);
          }
        };
        getProjects();
        getUser();
      }, []);

    const handleNewProject = () => {
        const createProject = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/user/create-program', {
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                navigate(`/document?id=${response.data.id}`);
            }
            catch(error){
                console.log(error)
            }
        }
        createProject();
    }

    const handleProject = (id: number) => {
        navigate(`/document?id=${id}`);
    }

    return (
        <div className={styles.dashboard}>
            <h1>
                <Typewriter
                    text={`Hi ${user? user['username' as any][Object.keys(user['username' as any])[0] as any] :"User"}, it's me Kevin!;What would you like to build today?`}
                    typeSpeed={60}
                    deleteSpeed={30}
                    delay={2000}
                    initialDelay={1000}
                />
            </h1>
            <hr />
            <div className={styles.projects}>
            {projects && projects.map((project, index) => {
                    return Object.entries(project).map(([key, value]) => (
                        <div key={key} className={styles.project} onClick={() => handleProject(index)}>
                            <h3>{value.name}</h3>
                            <iframe
                                srcDoc={`
                                    <html>
                                        <head>
                                            <style>${value.css}</style>
                                        </head>
                                        <body>
                                            ${value.html}
                                        </body>
                                    </html>
                                `}
                            />
                        </div>
                    ));
                })}
                <div className={styles.add} onClick={handleNewProject}>
                    <span>Add a project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
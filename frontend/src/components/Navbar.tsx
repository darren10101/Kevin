import styles from './Navbar.module.scss';
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NavbarProps {
    path: string;
    toggleKevin: () => void;
}

const Navbar = ({ path, toggleKevin}: NavbarProps) => {

    const [user, setUser] = useState('')
    const [recording, setRecording] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/user/get-user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(response.data);
                setUser(response.data);
                navigate('/');
            } catch (error) {
                console.error('Error getting user:', error);
            }
        };
        getUser();
    }, []);

    const signOutUser = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/user/logout', null, {
                withCredentials: true,
            });
            localStorage.removeItem('token');
            setUser('');
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    const handleKevin = () => {
        toggleKevin()
        setRecording(!recording)
    }

    return <nav className={styles.navbar}>
        <Link to='/dashboard'>
            <img src="/logo.png" alt="Frontend Kevin" />
        </Link>
        {
            user ? <>
                {path != '/dashboard' &&
                    <div className={recording ? styles.recording : styles.kevin} onClick={handleKevin}>
                        Code with Kevin
                        <svg height="80px" width="80px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <g>
                                <g>
                                    <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z" />
                                    <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z" />
                                </g>
                            </g>
                        </svg>
                    </div>}
                <div className={styles.menu}>
                    <Link to='/dashboard'>{user['username' as any][Object.keys(user['username' as any])[0] as any]}</Link>
                    <div className={styles.button} onClick={signOutUser} >
                        Logout
                    </div>
                </div>
            </>
                :
                <Link className={styles.button} to='/login'>Sign up</Link>
        }
    </nav>;
}

export default Navbar;
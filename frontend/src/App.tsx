import React, { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import axios from 'axios'
import './App.scss'
import Kevin from './entities/kevin'

function App() {
    const location = useLocation()
    const [showNavbar, setShowNavbar] = useState(true)
    const [path, setPath] = useState('')
    const [user, setUser] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/user/verify', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        setUser(true);
                    } else {
                        setUser(false);
                    }
                } catch (error) {
                    setUser(false);
                    console.error('Error verifying token:', error);
                }
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            setShowNavbar(false)
        } else {
            setShowNavbar(true)
        }
        setPath(location.pathname)
        document.title = 'Frontend Kevin'
    }, [location.pathname])
    const kevinRef = useRef<{ startListening: () => void; stopListening: () => void } | null>(null);

    const handleStartListening = () => {
        if (kevinRef.current) {
            console.log("Calling startListening");
            kevinRef.current.startListening(); // Call startListening from Kevin component
        }
    };
    return <>
        {showNavbar && <Navbar path={path} toggleKevin={handleStartListening} />}
        <Routes signedIn={user} />
        <Kevin ref={kevinRef}/>
    </>
}

export default App;
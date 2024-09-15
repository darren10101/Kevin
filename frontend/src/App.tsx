import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import axios from 'axios'
import './App.scss'
import Kevin from "./entities/kevin";
import { KevinProvider } from "./contexts/KevinContext";


function App() {
  const location = useLocation()
  const [showNavbar, setShowNavbar] = useState(true)
  const [path, setPath] = useState('')
  const [user, setUser] = useState(false)
  const [loading, setLoading] = useState(true)
  

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
  useEffect(() => {
    checkAuth().then(() => setLoading(false));
    console.log(user);
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

  const kevinRef = useRef<{ toggleListening: () => void } | null>(null);
    const handleToggleListening = () => {
        if (kevinRef.current) {
            console.log("calling toggle listening");
            kevinRef.current.toggleListening();
        }
    };
    return <KevinProvider>
        {showNavbar && <Navbar path={path} toggleKevin={handleToggleListening} />}
        {
            loading ? <></> : <Routes signedIn={user} />
        }
        <Kevin ref={kevinRef} />
    </KevinProvider>
};

export default App;
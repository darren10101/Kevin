import { useLocation } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.scss'

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
        const response = await axios.get('http://localhost:5000/user/verify', {
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

  return <>
    { showNavbar && <Navbar path={path} />}
    {
      loading ? <></> : <Routes signedIn={user} />
    }
  </>
}

export default App

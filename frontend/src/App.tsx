import { useLocation } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import './App.scss'
import { auth } from './firebase/client'

function App() {
  const location = useLocation()
  const [showNavbar, setShowNavbar] = useState(true)
  const [user] = useAuthState(auth)
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') {
      setShowNavbar(false)
    } else {
      setShowNavbar(true)
    }
    document.title = 'Frontend Kevin'
  }, [location.pathname])
  return <>
    { showNavbar && <Navbar />}
    <Routes signedIn={user?true:false} />
  </>
}

export default App

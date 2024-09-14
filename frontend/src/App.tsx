import { useLocation } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import { useEffect, useState } from 'react'

import './App.scss'

function App() {
  const location = useLocation()
  const [showNavbar, setShowNavbar] = useState(true)
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
    <Routes />
  </>
}

export default App

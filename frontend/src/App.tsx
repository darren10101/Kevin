import { BrowserRouter } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'
import { useEffect } from 'react'

import './App.css'

function App() {
  useEffect(() => {
    document.title = 'Frontend Kevin'
  }, [])
  return (
    <BrowserRouter basename='/'>
      <Navbar />
      <Routes />
    </BrowserRouter>
  )
}

export default App

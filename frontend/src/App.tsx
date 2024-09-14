import { BrowserRouter } from 'react-router-dom'
import { Routes } from './router/Router'
import Navbar from '@components/Navbar'

import './App.css'

function App() {

  return (
    <BrowserRouter basename='/'>
      <Navbar />
      <Routes />
    </BrowserRouter>
  )
}

export default App

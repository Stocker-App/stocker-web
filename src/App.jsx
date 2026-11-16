import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Rota da tela de login*/}
          <Route path="/login" element={<Login />} />

          {/*Rota da tela inicial*/}
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

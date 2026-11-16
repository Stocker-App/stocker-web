import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Rota da tela de login*/}
          <Route path="/login" element={<Login />} />

          {/*Rota da tela inicial*/}
          <Route path="/" element={<Home />} />

         
          {/* Rota para a página 404*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

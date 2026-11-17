import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Rota da tela de login*/}
          <Route path="/login" element={<Login />} />

          {/*Rota da tela inicial, evelopada dentro do componente ProtectedRoute para protegê-la*/}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Rota para a página 404*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

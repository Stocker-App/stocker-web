import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Home2 from './pages/Home2.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>

          {/*Rota da tela de login*/}
          <Route path="/login" element={<Login />} />

          {/*Rota do layout*/}
          {/*O layout engloba todas as páginas de uma vez só*/}
          {/*Todas as rotas são colocadas dentro da rota do layout*/}
          <Route 
          element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
          }
          >
            {/* Rota da página inicial */}
            <Route path="/" element={<Home />} />

            {/* Rota da página inicial 2 (só para testes)*/}
            <Route path="/home2" element={<Home2 />} />

            {/* Outras rotas serão adicionadas aqui */}

          </Route>

          {/* Rota para a página 404*/}
          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App

import './App.css'
import Movimentacoes from './pages/Movimentacoes';
import Produtos from './pages/Produtos';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Home2 from './pages/Home2.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

function App() {
  return (
    <>
      {/* AuthProvider envolve TUDO para que qualquer componente
          possa acessar os dados de autenticação via useAuth() */}
      <AuthProvider>
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

              {/* Rota da tela de dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Rota da tela de produtos */}
              <Route path="/produtos" element={<Produtos />} />

              {/* Rota da tela de movimentações */}
              <Route path="/movimentacoes" element={<Movimentacoes />} />

              {/* Outras rotas serão adicionadas aqui */}

            </Route>

            {/* Rota para a página 404*/}
            <Route path="*" element={<NotFound />} />

          </Routes>

        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import './Login.css'

export default function Login() {

  // Estados guardando e controlando nome de usuário e senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estados para feedback visual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hook de navegação do React Router para redirecionar após login bem-sucedido
  const navigate = useNavigate();

  // Hook personalizado que acessa o contexto de autenticação
  const { autenticado, login } = useAuth();

  // Se o usuário já estiver logado, redireciona para a página inicial
  if (autenticado) {
    return <Navigate to="/" replace/>;
  }

  // Função acionada ao clicar no botão de login ou dar Enter
  // Responsável por validar as credenciais e redirecionar o usuário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );
      const dados = await resposta.json();
      if (!resposta.ok) {
        setError(dados?.message || 'Nome de usuário ou senha inválidos');
        return;
      }

      // Usa a função login do contexto (que salva no estado global + localStorage)
      login(dados);

      navigate('/');
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

 return (
   <div className="login-container">
        <h1>Stocker</h1>
        <h2>Faça login</h2>

        {/* Formulário de login com inputs de nome de usuário e senha */}
        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="username"></label>
            <input type="text" id="username" name="username" required placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password"></label>
            <input type="password" id="password" name="password" required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* Mensagem de erro exibida caso o login falhe */}
          {error && <p className="error">{error}</p>}

          {/* Botão de login que muda de estado quando está carregando */}
          <button type="submit" disabled={loading}>
            {loading ? 'Fazendo login...' : 'Fazer login'}
          </button>

        </form>
   </div>
 );
}

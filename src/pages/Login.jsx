import { useState } from 'react';
import {useNavigate, Navigate} from 'react-router-dom';

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

  // Função acionada ao clicar no botão de login ou dar Enter
  // Responsável por validar as credenciais e redirecionar o usuário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que o HTML recarregue a paágina
    setError(''); // Define uma mensagem de erro vazia para limpar erros anteriores
    setLoading(true); // Define que está carregando para mostrar feedback visual

    // Simula uma espera de 1s para imitar uma requisição de login
    setTimeout(() => {
      // Regra de teste temporária para o login fake
      if (username === 'admin' && password === '123456'){
        // Guarda um token fake no navegador para simular autenticação
        localStorage.setItem('token', 'token-fake');

        // Define que não está mais carregando
        setLoading(false);

        // Redireciona para a página inicial
        navigate('/');
      }
      else {
        setLoading(false);

        // Seta o erro de credenciais incorretas
        setError('Nome de usuário ou senha inválidos');
      }
    }, 1000);
  }

  if (localStorage.getItem('token')) {
    // Se o usuário já estiver logado, redireciona para a página inicial
    return <Navigate to="/" replace/>;
  }

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
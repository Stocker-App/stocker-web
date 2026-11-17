import { useNavigate } from 'react-router-dom';

export default function Home() {
  
  const navigate = useNavigate();

  function logout() {
    // Remove o token do localStorage para simular logout
    localStorage.removeItem('token');

    // Redireciona para a página de login
    navigate('/login');
  }
  
  return (
   <div>
        <h1>Página inicial do Stocker</h1>
        <p>Aqui ficará o conteúdo de produtos e etc</p>

        <button onClick={logout} style={{ backgroundColor: 'red', color: 'white' }}>
          Logout
        </button>
   </div>
 );
}
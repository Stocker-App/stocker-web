import {useState} from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import './Sidebar.css';

export default function Sidebar() {
 const navigate = useNavigate();
 
 const [retraida, setRetraida] = useState(false);

 const logout = () => {
    // Remove o token do localStorage para realizar logout
    localStorage.removeItem('token');

    // Redireciona para a página de login
    navigate('/login');
  }
 
    return (
   <aside className={retraida ? 'sidebar sidebar-retraida' : 'sidebar'}>
       <div className="sidebar-header">
              <h2>Stocker</h2>

              <button onClick={() => setRetraida(!retraida)} className="retract-button">
                  {retraida ? '>' : '<'}
              </button>
       </div>

        <nav className="sidebar-nav">
            <NavLink to="/" className="sidebar-link">
                Início
            </NavLink>

            <NavLink to="/home2" className="sidebar-link">
                Início 2
            </NavLink>

            <NavLink to="/dashboard" className="sidebar-link">
                Dashboard
            </NavLink>
            <NavLink to="/movimentacoes" className="sidebar-link">
                Movimentações
            </NavLink>
        </nav>

        <div className="sidebar-footer">
            <button onClick={logout} className="logout-button">
                Sair
            </button>
        </div>
        
   </aside>
 );
}

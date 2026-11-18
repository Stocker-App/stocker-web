import { NavLink, useNavigate } from "react-router-dom";
import './Sidebar.css';

export default function Sidebar() {
 const navigate = useNavigate();

 const logout = () => {
    // Remove o token do localStorage para realizar logout
    localStorage.removeItem('token');

    // Redireciona para a página de login
    navigate('/login');
  }
 
    return (
   <aside className="sidebar">
       <div className="sidebar-header">
              <h2>Stocker</h2>
       </div>

        <nav className="sidebar-nav">
            <NavLink to="/" className="sidebar-link">
                Início
            </NavLink>

            <NavLink to="/home2" className="sidebar-link">
                Início 2
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

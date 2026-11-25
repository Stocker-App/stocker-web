import {Outlet} from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import './Layout.css';

export default function Layout() {
 return (
   <div className="layout-container">
        {/*Renderiza a barra lateral*/}
        <Sidebar />

        {/*Renderiza o conteúdo principal (as páginas)*/}
        <main className="layout-content">
          <Outlet />
        </main>
        
   </div>
 );
}

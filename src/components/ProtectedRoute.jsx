import { Navigate } from 'react-router-dom';

// Children = qualquer componente que for renderizado dentro do ProtectedRoute
export default function ProtectedRoute({children}) {
    
    // Verifica se o token existe no localStorage, indicando que o usuário está autenticado
    const token = localStorage.getItem('token');
    
    // Se não houver token, redireciona para a página de login
    if (!token) {
        return <Navigate to="/login" replace/>;
        // O replace evita que o usuário possa voltar para a página protegida usando o botão de voltar do navegador
    }

    // Se houver token, renderiza os componentes filhos (children), ou seja, a página
    return children;
}
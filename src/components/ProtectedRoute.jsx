import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Children = qualquer componente que for renderizado dentro do ProtectedRoute
export default function ProtectedRoute({children}) {
    
    // Usa o hook personalizado para verificar se o usuário está autenticado
    const { autenticado } = useAuth();
    
    // Se não estiver autenticado, redireciona para a página de login
    if (!autenticado) {
        return <Navigate to="/login" replace/>;
        // O replace evita que o usuário possa voltar para a página protegida usando o botão de voltar do navegador
    }

    // Se estiver autenticado, renderiza os componentes filhos (children), ou seja, a página
    return children;
}

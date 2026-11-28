import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Hook personalizado para acessar o contexto de autenticação.
// Em vez de cada componente importar useContext + AuthContext,
// basta importar useAuth() e pronto!
//
// Uso:
//   const { autenticado, usuario, login, logout } = useAuth();
//
export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }

  return context;
}

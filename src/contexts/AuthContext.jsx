import { createContext, useReducer, useEffect } from 'react';

// ── Estado inicial ──────────────────────────────────────────────
// Quando o app abre, tenta recuperar a sessão salva no localStorage.
// Se existir token + dados do usuário, já começa "logado".
function carregarEstadoInicial() {
  const token = localStorage.getItem('token');
  const usuarioSalvo = localStorage.getItem('usuario');

  if (token && usuarioSalvo) {
    return {
      autenticado: true,
      token,
      usuario: JSON.parse(usuarioSalvo),
    };
  }

  return {
    autenticado: false,
    token: null,
    usuario: null,
  };
}

// ── Reducer ─────────────────────────────────────────────────────
// O reducer é uma função que recebe o estado atual e uma "ação"
// (tipo um pedido: "faça LOGIN" ou "faça LOGOUT") e devolve o novo estado.
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        autenticado: true,
        token: action.payload.token,
        usuario: action.payload.usuario,
      };

    case 'LOGOUT':
      return {
        autenticado: false,
        token: null,
        usuario: null,
      };

    default:
      return state;
  }
}

// ── Contexto ────────────────────────────────────────────────────
// Cria o "depósito global" que qualquer componente poderá acessar.
export const AuthContext = createContext();

// ── Provider ────────────────────────────────────────────────────
// Componente que envolve todo o app e fornece os dados de autenticação.
export function AuthProvider({ children }) {
  // useReducer funciona como um useState mais organizado:
  // - state = os dados atuais (autenticado, token, usuario)
  // - dispatch = função para enviar ações ("LOGIN", "LOGOUT")
  const [state, dispatch] = useReducer(authReducer, null, carregarEstadoInicial);

  // Sempre que o estado mudar, sincroniza com o localStorage.
  // Assim, se o usuário recarregar a página, a sessão continua.
  useEffect(() => {
    if (state.autenticado) {
      localStorage.setItem('token', state.token);
      localStorage.setItem('usuario', JSON.stringify(state.usuario));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }, [state]);

  // Funções prontas que os componentes vão chamar
  const login = (dadosDoServidor) => {
    dispatch({
      type: 'LOGIN',
      payload: {
        token: dadosDoServidor.token,
        usuario: {
          id: dadosDoServidor.id,
          nome: dadosDoServidor.nome,
          username: dadosDoServidor.username,
          role: dadosDoServidor.role,
        },
      },
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Tudo que está dentro de "value" fica disponível para qualquer
  // componente que usar o useAuth() (nosso hook personalizado).
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

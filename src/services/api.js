const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiFetch(caminho, opcoes = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...opcoes.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers,
  });

  if (resposta.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    throw new Error(dados?.message || 'Erro ao comunicar com o servidor.');
  }

  return dados;
}
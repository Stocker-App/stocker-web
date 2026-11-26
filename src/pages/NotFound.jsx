// Página 404 customizada (quando o usuário acessar uma página que não existe)

//Importa o Link, que será usado para redirecionar o usuário de volta
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Opa, acho que você não deveria estar aqui...</h2>
      <p>A página que você está procurando não existe ou foi movida.</p>
      
      {/* O link para o usuário não ficar preso */}
      <Link to="/">Voltar para o início</Link>
    </div>
  );
}
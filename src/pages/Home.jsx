import { useNavigate } from 'react-router-dom';

export default function Home() {
  
  const navigate = useNavigate();
  
  return (
   <div>
        <h1>Página inicial do Stocker</h1>
        <p>Aqui ficará o conteúdo de produtos e etc</p>
   </div>
 );
}
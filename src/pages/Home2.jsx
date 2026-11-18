import { useNavigate } from 'react-router-dom';

export default function Home2() {
 const navigate = useNavigate();

 return (
   <div>
        <h1>Página inicial 2 do Stocker</h1>
        <p>Somente para testar navegação</p>
   </div>
 );
}

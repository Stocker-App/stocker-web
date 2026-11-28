export default function Login() {
 return (
   <div className="pagina-login">
        <h1>Stocker</h1>
        <h2>Faça login</h2>

        <form>
          <div>
            <label htmlFor="username"></label>
            <input type="text" id="username" name="username" required placeholder="Nome de usuário" />
          </div>
          <div>
            <label htmlFor="password"></label>
            <input type="password" id="password" name="password" required placeholder="Senha" />
          </div>
          <button type="submit">Fazer login</button>
        </form>
   </div>
 );
}
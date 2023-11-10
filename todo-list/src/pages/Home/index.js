import { useState } from "react";
import "./home.css";

import { Link } from "react-router-dom";

import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";

// Componente Home que é utilizado para fazer o login no sistema e acessar a rota /admin da aplicação
export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Função que é executada quando o formulário é submetido para fazer o login no sistema
  async function handleLogin(e) {
    e.preventDefault();

    // verifica se os campos email e password foram preenchidos para fazer o login
    if (email !== "" && password !== "") {
      // faz o login no sistema com o email e password informados
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // navegar para /admin
          // se o login foi realizado com sucesso, redireciona para a rota /admin da aplicação
          // replace: true é utilizado para substituir a rota atual pela rota /admin
          navigate("/admin", { replace: true });
        })
        .catch(() => {
          // se ocorreu algum erro ao fazer o login, exibe uma mensagem de erro
          console.log("ERRO AO FAZER O LOGIN");
        });
    } else {
      // caso os campos email e password não tenham sido preenchidos, exibe uma mensagem de erro
      alert("Preencha todos os campos!");
    }
  }

  return (
    <div className="home-container">
      <h1>Lista de tarefas</h1>
      <span>Gerencie sua agenda de forma fácil.</span>

      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Digite seu email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Acessar</button>
      </form>

      <Link className="button-link" to="/register">
        Não possui uma conta? Cadastre-se
      </Link>
    </div>
  );
}

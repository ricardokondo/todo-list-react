import { useState } from "react";

import { Link } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Componente Register que é utilizado para cadastrar um novo usuário no sistema
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Função que é executada quando o formulário é submetido para cadastrar um novo usuário no sistema
  async function handleRegister(e) {
    e.preventDefault();

    // verifica se os campos email e password foram preenchidos
    if (email !== "" && password !== "") {
      // cria um novo usuário no sistema
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // se o usuário foi criado com sucesso, redireciona para a rota /admin da aplicação
          navigate("/admin", { replace: true });
        })
        .catch(() => {
          // se ocorreu algum erro ao criar o usuário, exibe uma mensagem de erro
          console.log("ERRO AO FAZER O CADASTRO");
        });
    } else {
      // Caso os campos email e password não tenham sido preenchidos, exibe uma mensagem de erro
      alert("Preencha todos os campos!");
    }
  }

  return (
    <div className="home-container">
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta!</span>

      <form className="form" onSubmit={handleRegister}>
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

        <button type="submit">Cadastrar</button>
      </form>

      <Link className="button-link" to="/">
        Já possui uma conta? Faça login!
      </Link>
    </div>
  );
}

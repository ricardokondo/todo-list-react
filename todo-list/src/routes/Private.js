import { useState, useEffect } from "react";

import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

import { Navigate } from "react-router-dom";

// Componente Private que verifica se o usuário está logado para acessar a rota /admin da aplicação
export default function Private({ children }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está logado
    async function checkLogin() {
      const unsub = onAuthStateChanged(auth, (user) => {
        //se tem user logado no sistema
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
          };

          // localStorage.setItem é utilizado para armazenar o objeto userData no localStorage do navegador do usuário
          // JSON.stringify é utilizado para converter o objeto userData em uma string JSON
          // O objeto userData é armazenado no localStorage do navegador do usuário com a chave @detailUser
          localStorage.setItem("@detailUser", JSON.stringify(userData));

          setLoading(false);
          setSigned(true);
        } else {
          //nao possui user logado
          setLoading(false);
          setSigned(false);
        }
      });
    }

    checkLogin();
  }, []);

  // Se o loading for true, retorna um elemento vazio para não exibir nada na tela
  if (loading) {
    return <div></div>;
  }

  // Se o usuário não estiver logado, redireciona para a rota / da aplicação
  if (!signed) {
    return <Navigate to="/" />;
  }

  // Se o usuário estiver logado, retorna o componente children que é o componente Admin
  return children;
}

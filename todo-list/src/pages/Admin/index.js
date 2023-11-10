import { useState, useEffect } from "react";
import "./admin.css";

import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// Componente Admin que é utilizado para gerenciar as tarefas do usuário logado no sistema
export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState("");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState({});

  const [tarefas, setTarefas] = useState([]);

  // Carrega as tarefas do usuário logado no sistema ao acessar a rota /admin da aplicação e ao atualizar a página
  useEffect(() => {
    // Função que carrega as tarefas do usuário logado no sistema
    async function loadTarefas() {
      // localStorage.getItem é utilizado para recuperar o objeto userData do localStorage do navegador do usuário
      // JSON.parse é utilizado para converter a string JSON em um objeto JavaScript novamente e armazenar na variável data o objeto userData
      const userDetail = localStorage.getItem("@detailUser");
      // setUser é utilizado para armazenar o objeto userData na variável user
      setUser(JSON.parse(userDetail));

      // Verifica se o usuário está logado utilizando o objeto user retornado pelo localStorage.getItem
      if (userDetail) {
        const data = JSON.parse(userDetail);
        // collection é utilizado para acessar a coleção tarefas do banco de dados Firestore do Firebase
        const tarefaRef = collection(db, "tarefas");
        // query é utilizado para realizar uma consulta na coleção tarefas do banco de dados Firestore do Firebase
        // para recuperar as tarefas do usuário logado no sistema
        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );

        // onSnapshot é utilizado para recuperar os dados da consulta realizada na coleção tarefas do banco de dados Firestore do Firebase
        // e atualizar a variável tarefas com os dados retornados da consulta
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });

          setTarefas(lista);
        });
      }
    }

    loadTarefas();
  }, []);

  // Registra uma nova tarefa no banco de dados Firestore do Firebase ou atualiza uma tarefa existente
  async function handleRegister(e) {
    e.preventDefault();

    // Verifica se o campo tarefa foi preenchido para registrar uma nova tarefa
    if (tarefaInput === "") {
      alert("Digite sua tarefa...");
      return;
    }
    // Verifica se o campo tarefa foi preenchido para atualizar uma tarefa existente
    if (edit?.id) {
      handleUpdateTarefa();
      return;
    }
    // addDoc é utilizado para registrar uma nova tarefa no banco de dados Firestore do Firebase
    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        console.log("TAREFA REGISTRADA");
        setTarefaInput("");
      })
      .catch((error) => {
        console.log("ERRO AO REGISTRAR " + error);
      });
  }

  // Realiza o logout
  async function handleLogout() {
    await signOut(auth);
  }

  // Deleta a tarefa selecionada pelo usuário
  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  // Editar informações de uma tarefa existente no banco de dados Firestore do Firebase
  function editTarefa(item) {
    setTarefaInput(item.tarefa);
    setEdit(item);
  }

  // Função que atualiza as informações de uma tarefa
  async function handleUpdateTarefa() {
    // edit?.id é utilizado para verificar se a variável edit possui o atributo id
    const docRef = doc(db, "tarefas", edit?.id);
    // updateDoc é utilizado para atualizar as informações de uma tarefa existente no banco de dados Firestore do Firebase
    await updateDoc(docRef, {
      tarefa: tarefaInput,
    })
      .then(() => {
        console.log("TAREFA ATUALIZADA");
        setTarefaInput("");
        setEdit({});
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR");
        setTarefaInput("");
        setEdit({});
      });
  }

  return (
    <div className="admin-container">
      <h1>Minhas tarefas</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
        />

        {Object.keys(edit).length > 0 ? (
          <button className="btn-register" type="submit">
            Atualizar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
      </form>

      {tarefas.map((item) => (
        <article key={item.id} className="list">
          <p>{item.tarefa}</p>
          <div>
            <button onClick={() => editTarefa(item)}>Editar</button>
            <button
              onClick={() => deleteTarefa(item.id)}
              className="btn-delete"
            >
              Concluir
            </button>
          </div>
        </article>
      ))}

      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

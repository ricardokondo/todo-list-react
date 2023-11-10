import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";

// Definição do componente App que é o componente raiz da aplicação e que contém as rotas da aplicação
export default function App() {
  return (
    <BrowserRouter>
      <RoutesApp />
    </BrowserRouter>
  );
}

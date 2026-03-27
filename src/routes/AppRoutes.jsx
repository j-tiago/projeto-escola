import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import Cadastro from "../Components/Cadastro/Cadastro";
import Inicio from "../Components/Inicio/Inicio";
import CadastroEscola from "../Components/CadastroEscola/CadastroEscola";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("meu_token");
  
  if (!token) {
    return <Navigate to="/" replace />; 
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Inicio />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/nova-escola" 
          element={
            <PrivateRoute>
              <CadastroEscola />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/editar-escola/:id" 
          element={
            <PrivateRoute>
              <CadastroEscola />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
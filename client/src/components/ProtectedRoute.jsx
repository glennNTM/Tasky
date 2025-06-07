
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // const navigate = useNavigate();

  // // Simulation de vérification d'authentification
  // const isAuthenticated = localStorage.getItem('user') !== null;

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  // Pour les tests, on rend directement les enfants
  return children;
};

export default ProtectedRoute;

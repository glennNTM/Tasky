
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  // Vérification d'authentification
  const isAuthenticated = localStorage.getItem('user') !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Rediriger vers /login si pas authentifié
    }
  }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return null;
  // }

  // Pour les tests, on rend directement les enfants
  return children;
}

export default ProtectedRoute;

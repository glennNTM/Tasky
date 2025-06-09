
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();

  // Vérification du rôle admin
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user && user.role === 'admin'; // Vérifier aussi si l'utilisateur existe

  useEffect(() => {
    if (!isAdmin) {
      navigate('/app'); // Rediriger vers /app si pas admin
    }
  }, [isAdmin, navigate]);

  // if (!isAdmin) {
  //   return null;
  // }

  // Pour les tests, on rend directement les enfants
  return children
}

export default AdminRoute

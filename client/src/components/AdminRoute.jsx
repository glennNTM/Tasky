
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // const navigate = useNavigate();

  // // Simulation de vérification du rôle admin
  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  // const isAdmin = user.role === 'admin';

  // useEffect(() => {
  //   if (!isAdmin) {
  //     navigate('/app');
  //   }
  // }, [isAdmin, navigate]);

  // if (!isAdmin) {
  //   return null;
  // }

  // Pour les tests, on rend directement les enfants
  return children;
};

export default AdminRoute;

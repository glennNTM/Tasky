
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // useParams n'est plus utilisé ici
import { toast } from 'sonner'
// authService n'est plus directement appelé ici car le token est déjà fourni par le serveur

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Pour lire les query params

  useEffect(() => {
    const handleOAuthSuccess = () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const userString = urlParams.get('user');
        const error = urlParams.get('error');
        const oauthSuccess = urlParams.get('oauth_success');
        const provider = urlParams.get('provider') || 'OAuth'; // Récupère le fournisseur

        if (error) {
          throw new Error(`Erreur ${provider} (depuis serveur): ${error} - ${urlParams.get('message') || ''}`);
        }

        if (oauthSuccess === 'true' && token && userString) {
          const user = JSON.parse(userString);
          console.log(`Connexion ${provider} réussie via serveur. Token:`, token, "User:", user);
          // Stocker les informations utilisateur
          localStorage.setItem('user', JSON.stringify({
            ...user,
            token: token
          }));

          toast.success(`Connexion ${provider} réussie !`);
          // Redirection conditionnelle en fonction du rôle
          if (user.role === 'admin') {
            navigate("/app/admin");
          } else {
            navigate('/app');
          }
        } else if (!oauthSuccess) { // Si on arrive ici sans code ni succès, c'est probablement une erreur ou un accès direct
          throw new Error('Paramètres de callback OAuth invalides ou manquants.');
        }
      } catch (error) {
        const providerFromQuery = new URLSearchParams(location.search).get('provider') || 'OAuth';
        console.error(`Erreur lors du traitement du callback ${providerFromQuery}:`, error);
        toast.error(`Erreur ${providerFromQuery}: ${error.message}`);
        navigate('/login')
      }
    };

    handleOAuthSuccess();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Finalisation de la connexion...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback

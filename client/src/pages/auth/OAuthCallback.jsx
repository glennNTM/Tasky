
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/api';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { provider } = useParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Erreur ${provider}: ${error}`);
        }

        if (!code) {
          throw new Error('Code d\'autorisation manquant');
        }

        console.log(`Traitement du callback ${provider} avec le code:`, code);

        // Envoyer le code au backend pour échanger contre un token
        const response = await authService.oauthCallback(provider, code);
        
        if (response.data.user && response.data.token) {
          // Stocker les informations utilisateur
          localStorage.setItem('user', JSON.stringify({
            ...response.data.user,
            token: response.data.token
          }));

          toast.success(`Connexion ${provider} réussie !`);
          navigate('/app');
        } else {
          throw new Error('Réponse invalide du serveur');
        }
      } catch (error) {
        console.error(`Erreur ${provider} OAuth:`, error);
        toast.error(`Erreur lors de la connexion ${provider}: ${error.message}`);
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [provider, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">
          Finalisation de la connexion {provider}...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;

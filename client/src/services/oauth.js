
// Service OAuth pour Google et GitHub
export const oauthService = {
  // Authentification Google
  signInWithGoogle: () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      throw new Error('Google Client ID non configuré');
    }

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: `${window.location.origin}/auth/callback/google`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  },

  // Authentification GitHub
  signInWithGitHub: () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    
    if (!githubClientId) {
      throw new Error('GitHub Client ID non configuré');
    }

    const params = new URLSearchParams({
      client_id: githubClientId,
      redirect_uri: `${window.location.origin}/auth/callback/github`,
      scope: 'user:email',
      state: Math.random().toString(36).substring(7)
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }
};

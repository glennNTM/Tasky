import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Brain, Github, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/api";
import { oauthService } from "@/services/oauth";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("POST /api/auth/register", formData);
      const response = await authService.register(formData);
      
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await oauthService.signInWithGoogle();
    } catch (error) {
      console.error("Erreur Google OAuth:", error);
      toast.error(error.message || "Erreur lors de l'inscription Google");
    }
  };

  const handleGithubRegister = async () => {
    try {
      await oauthService.signInWithGitHub();
    } catch (error) {
      console.error("Erreur GitHub OAuth:", error);
      toast.error(error.message || "Erreur lors de l'inscription GitHub");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Tasky</span>
            </div>
          </div>

          <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 relative">
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-gray-900 dark:text-white">Créer un compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Boutons OAuth */}
              {/* <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  S'inscrire avec Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGithubRegister}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Github className="h-4 w-4 mr-2" />
                  S'inscrire avec GitHub
                </Button>
              </div> */}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-200 dark:bg-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                 {/*<span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Ou s'inscrire avec
                  </span>*/}
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nom complet</Label>
                  <Input // L'id HTML peut rester "name" si vous le souhaitez, mais la valeur et le handleChange doivent utiliser "fullname"
                    id="name"
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => handleChange("fullname", e.target.value)}
                    placeholder="Votre nom complet"
                    required
                    disabled={isLoading}
                    className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="votre@email.com"
                    required
                    disabled={isLoading}
                    className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Votre mot de passe"
                      required
                      disabled={isLoading}
                      className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? "Inscription..." : "S'inscrire"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Déjà un compte ? </span>
                <Link to="/login" className="text-purple-600 hover:underline font-medium">
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

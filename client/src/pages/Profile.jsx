
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Save, Lock, Edit, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("PUT /api/users/profile", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      console.log("PUT /api/users/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Mot de passe modifié avec succès !");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      toast.error("Erreur lors de la modification du mot de passe");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (file, imageUrl) => {
    setProfileImage({ file, url: imageUrl });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <ImageUpload
            currentImage={profileImage?.url}
            onImageChange={handleImageChange}
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{formData.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{formData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations personnelles */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  Informations personnelles
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Annuler" : "Modifier"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nom complet</Label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{formData.name}</p>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</Label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{formData.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                  <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mot de passe actuel
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleChange("currentPassword", e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white pr-10"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleChange("newPassword", e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white pr-10"
                      placeholder="Choisissez un nouveau mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 text-gray-900 dark:text-white pr-10"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  <Lock className="h-4 w-4 mr-2" />
                  Modifier le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

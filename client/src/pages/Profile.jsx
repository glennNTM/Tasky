
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Save, Lock, Edit, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
//import ImageUpload from "@/components/ImageUpload"
import { userService } from "@/services/api"

const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  //const [profileImage, setProfileImage] = useState(null);
  
  // Récupérer l'ID de l'utilisateur depuis le localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = storedUser?._id
  console.log(userId)


  const [formData, setFormData] = useState({
    fullname: "", 
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const { data: userProfile, isLoading: isLoadingProfile, isError: isProfileError, error: profileError } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId, // Ne lance la requête que si userId est disponible
    onSuccess: (response) => {
      const data = response.data.data
      setFormData(prev => ({
        ...prev,
        fullname: data.fullname || "",
        email: data.email || ""
      }));
       // if (data.profilePictureUrl) {
      //   setProfileImage({ file: null, url: data.profilePictureUrl });
      // }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors du chargement du profil.");
    }
  })

  const actualUserData = userProfile?.data?.data;

  const updateUserMutation = useMutation({
    mutationFn: (profileData) => userService.updateUserProfile(userId, profileData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);
      // Mettre à jour l'utilisateur dans localStorage si nécessaire, ex: si le nom change
      const updatedUser = { ...storedUser, fullname: response.data.data.fullname, email: response.data.data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Rafraîchir la page ou mettre à jour l'état global de l'utilisateur peut être nécessaire pour voir les changements partout (ex: Navbar)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil.");
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (passwordData) => userService.updatePassword(passwordData),
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès !");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la modification du mot de passe.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToUpdate = {
      fullname: formData.fullname,
      email: formData.email,
      // Si l'URL de l'image a changé et qu'un nouveau fichier n'est pas la source (ex: suppression ou URL externe)
      // Ou si un nouveau fichier a été téléversé et son URL finale est dans profileImage.url
      //profilePictureUrl: profileImage?.url 
    };
    updateUserMutation.mutate(dataToUpdate);
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    updatePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 // const handleImageChange = (file, imageUrl) => {
  //   setProfileImage({ file, url: imageUrl });
  //   // Si l'image est téléversée immédiatement par ImageUpload et que imageUrl est l'URL finale,
  //   // vous pourriez vouloir déclencher updateUserMutation ici ou attendre la sauvegarde manuelle.
  //   // Pour l'instant, on suppose que l'URL est mise à jour dans le formulaire et sauvegardée avec le reste.
  // };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isProfileError && !userProfile) { // Afficher l'erreur seulement si le profil n'a pas pu être chargé
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{profileError?.response?.data?.message || "Impossible de charger le profil."}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
         {/* <ImageUpload
            currentImage={profileImage?.url}
            onImageChange={handleImageChange}
          />*/}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{actualUserData?.fullname || (isLoadingProfile ? 'Chargement...' : '')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{actualUserData?.email || (isLoadingProfile ? 'Chargement...' : '')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations personnelles */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Informations personnelles
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
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
                    <Label htmlFor="fullname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom complet
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => handleChange("fullname", e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-gray-900 dark:text-white"
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
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder les modifications
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nom complet</Label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{actualUserData?.fullname || 'Non défini'}</p>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</Label>
                    <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">{actualUserData?.email || 'Non défini'}</p>
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
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-gray-900 dark:text-white pr-10"
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
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-gray-900 dark:text-white pr-10"
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
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-gray-900 dark:text-white pr-10"
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

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={updatePasswordMutation.isPending}>
                  {updatePasswordMutation.isPending ? (
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Modifier le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
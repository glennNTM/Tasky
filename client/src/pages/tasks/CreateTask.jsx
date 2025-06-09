
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/api";

const CreateTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: "",        // Changé de 'title' à 'titre'
    description: "",
    statut: "en attente", // Changé de 'status' à 'statut', et valeur par défaut alignée avec le modèle serveur
    priorité: "moyenne",  // Changé de 'priority' à 'priorité', et valeur par défaut alignée avec le modèle serveur
    dateEcheance: ""  // Changé de 'dueDate' à 'dateEcheance'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // formData contient maintenant les bons noms de champs pour l'API
      await taskService.createTask(formData);
      // Invalider la requête pour 'myTasks' pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      toast.success("Tâche créée avec succès !");
      navigate("/app")
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la création de la tâche");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusIcon = (status) => {
    const icons = {
      'en attente': <Clock className="h-4 w-4 text-amber-600" />,
      'en cours': <AlertCircle className="h-4 w-4 text-blue-600" />,
      'terminée': <CheckCircle className="h-4 w-4 text-green-600" />
    };
    return icons[status] || <Clock className="h-4 w-4 text-gray-500" />; // Fallback icon
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer une nouvelle tâche</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Ajoutez une nouvelle tâche à votre liste.</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Informations de la tâche</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="titre" className="text-gray-900 dark:text-white">Titre de la tâche</Label>
                <Input
                  id="titre"
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleChange("titre", e.target.value)}
                  placeholder="Entrez le titre de la tâche"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Décrivez votre tâche..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status" className="text-gray-900 dark:text-white flex items-center gap-2">
                    {getStatusIcon(formData.statut)}
                    Statut
                  </Label>
                  <Select value={formData.statut} onValueChange={(value) => handleChange("statut", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en attente">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          À faire
                        </div>
                      </SelectItem>
                      <SelectItem value="en cours">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          En cours
                        </div>
                      </SelectItem>
                      <SelectItem value="terminée">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Terminée
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priorité" className="text-gray-900 dark:text-white">Priorité</Label>
                  <Select value={formData.priorité} onValueChange={(value) => handleChange("priorité", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basse">Faible</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="haute">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dateEcheance" className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Date d'échéance
                </Label>
                <Input
                  id="dateEcheance"
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => handleChange("dateEcheance", e.target.value)}
                  required // Ajout de required car c'est obligatoire côté serveur
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Créer la tâche
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/app")}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTask;


import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { taskService } from "@/services/api";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    statut: "en attente",
    priorité: "moyenne",
    dateEcheance: ""
  });

  const { data: taskData, isLoading: isLoadingTask, isError: isTaskError, error: taskError } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await taskService.getTaskById(id);
      return response.data.data;
    },
    enabled: !!id, // Seulement si l'ID est présent
    onSuccess: (data) => {
      // Initialiser le formulaire avec les données de la tâche
      setFormData({
        titre: data.titre || "",
        description: data.description || "",
        statut: data.statut || "en attente",
        priorité: data.priorité || "moyenne",
        dateEcheance: data.dateEcheance ? new Date(data.dateEcheance).toISOString().split('T')[0] : ""
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors du chargement de la tâche.");
      navigate("/app/tasks");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedTaskData) => taskService.updateTask(id, updatedTaskData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      toast.success("Tâche modifiée avec succès !");
      navigate(`/app/tasks/${id}`); // Rediriger vers la page de détail de la tâche mise à jour
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la modification de la tâche.");
    }
  });

  // Gérer les changements de formulaire
  useEffect(() => {
    if (taskData) {
      setFormData({
        titre: taskData.titre || "",
        description: taskData.description || "",
        statut: taskData.statut || "en attente",
        priorité: taskData.priorité || "moyenne",
        dateEcheance: taskData.dateEcheance ? new Date(taskData.dateEcheance).toISOString().split('T')[0] : ""
      });
    }
  }, [taskData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assurez-vous que la date d'échéance est bien formatée si elle est présente
    const submissionData = {
      ...formData,
      dateEcheance: formData.dateEcheance ? new Date(formData.dateEcheance).toISOString() : undefined,
    };
    // Filtrer les champs undefined pour ne pas envoyer de valeurs nulles non intentionnelles
    Object.keys(submissionData).forEach(key => submissionData[key] === undefined && delete submissionData[key]);

    updateMutation.mutate(submissionData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusIcon = (statut) => {
    const icons = {
      'en attente': <Clock className="h-4 w-4 text-amber-600" />,
      'en cours': <AlertCircle className="h-4 w-4 text-blue-600" />,
      'terminée': <CheckCircle className="h-4 w-4 text-purple-600" />
    };
    return icons[statut];
  };

  if (isLoadingTask) {
    return (
      <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isTaskError) {
    // L'erreur est déjà gérée par onError de useQuery, mais on peut afficher un message ici aussi
    return (
      <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Erreur: {taskError?.response?.data?.message || "Impossible de charger les données de la tâche."}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier la tâche</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Modifiez les informations de votre tâche.</p>
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
                  <Label htmlFor="statut" className="text-gray-900 dark:text-white flex items-center gap-2">
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
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                          Terminée
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-gray-900 dark:text-white">Priorité</Label>
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
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Date d'échéance
                </Label>
                <Input
                  id="dateEcheance"
                  type="date"
                  value={formData.dateEcheance}
                  onChange={(e) => handleChange("dateEcheance", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sauvegarder les modifications
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(id ? `/app/tasks/${id}` : "/app/tasks")}
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

export default EditTask;

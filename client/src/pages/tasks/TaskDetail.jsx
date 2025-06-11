
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, AlertCircle, Clock, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { taskService } from "@/services/api"; // Importer taskService

const TaskDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: task, isLoading, isError, error: fetchError } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await taskService.getTaskById(id);
      return response.data.data; // L'API renvoie la tâche dans response.data.data
    },
    enabled: !!id, // Ne lance la requête que si l'ID est présent
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors du chargement de la tâche.");
      navigate("/app");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] }); // Invalider la liste des tâches
      queryClient.removeQueries({ queryKey: ['task', id] }); // Supprimer le cache de cette tâche
      toast.success("Tâche supprimée avec succès !");
      navigate("/app");
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de la tâche.");
      setDeleteModalOpen(false);
    },
  });

  const handleDelete = () => {
    if (task?._id) {
      deleteMutation.mutate(task._id);
    }
  };

  // Fonctions utilitaires adaptées aux valeurs du backend
  const getPriorityBadge = (priorite) => {
    const priorityConfig = {
      'basse': { label: 'Faible', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-300' },
      'moyenne': { label: 'Moyenne', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300' },
      'haute': { label: 'Élevée', className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-300' }
    };
    const config = priorityConfig[priorite] || { label: 'Non définie', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return (
      <Badge className={`w-fit ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'en attente': { label: 'À faire', icon: Clock, className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300' },
      'en cours': { label: 'En cours', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300' },
      'terminée': { label: 'Terminée', icon: CheckCircle, className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300' }
    };
    const config = statusConfig[statut] || { label: 'Indéfini', icon: Clock, className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    const IconComponent = config.icon;
    return (
      <Badge className={`flex items-center gap-1 w-fit ${config.className}`}>
        <IconComponent className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="animate-pulse">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4 mx-auto"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !task) {
    // L'erreur est déjà gérée par onError de useQuery, mais on garde un fallback
    return (
      <div className="max-w-4xl mx-auto text-center py-12 p-4 md:p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {fetchError?.response?.data?.message || "Tâche non trouvée ou erreur de chargement."}
        </h2>
        <Button onClick={() => navigate("/app")} className="mt-4">
          Retour à mes tâches
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/app")}
          className="mb-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes tâches
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{task.titre}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={() => navigate(`/app/tasks/${task._id}/edit`)}
              className="flex items-center gap-2 flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 flex-1 sm:flex-none"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4" />}
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-gray-900 dark:text-white">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {task.description || "Aucune description disponible pour cette tâche."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 dark:text-white">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Statut</label>
                <div className="mt-1">
                  {getStatusBadge(task.statut)}
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Priorité</label>
                <div className="mt-1">
                  {getPriorityBadge(task.priorité)}
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date d'échéance</label>
                <div className="mt-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  {task.dateEcheance ? new Date(task.dateEcheance).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : "Aucune date limite"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la tâche"
        description={`Êtes-vous sûr de vouloir supprimer la tâche "${task?.titre}" ? Cette action est irréversible.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default TaskDetail;

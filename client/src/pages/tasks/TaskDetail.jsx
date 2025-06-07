
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, AlertCircle, Clock, Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const TaskDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        // Simulation d'appel API
        console.log(`GET /api/tasks/${id}`);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données de démonstration
        const mockTask = {
          id,
          title: "Finaliser le rapport mensuel",
          description: "Compléter l'analyse des données de vente du mois précédent et préparer le rapport pour la direction. Inclure les graphiques et recommandations.",
          dueDate: "2024-01-15",
          priority: "high",
          status: "in-progress",
          createdAt: "2024-01-10",
          updatedAt: "2024-01-12"
        };
        
        setTask(mockTask);
        setLoading(false);
      } catch (error) {
        toast.error("Erreur lors du chargement de la tâche");
        navigate("/app/tasks");
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      // Simulation d'appel API
      console.log(`DELETE /api/tasks/${id}`);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Tâche supprimée avec succès !");
      navigate("/app/tasks");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'todo': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in-progress': return 'En cours';
      case 'todo': return 'À faire';
      default: return 'À faire';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Non définie';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Tâche non trouvée</h2>
        <Button onClick={() => navigate("/app/tasks")} className="mt-4">
          Retour à mes tâches
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/app/tasks")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes tâches
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600 mt-2">Créée le {new Date(task.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(`/app/tasks/${id}/edit`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {task.description || "Aucune description disponible pour cette tâche."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Statut</label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(task.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(task.status)}
                    {getStatusText(task.status)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Priorité</label>
                <div className="mt-1">
                  <Badge className={`${getPriorityColor(task.priority)} w-fit`}>
                    {getPriorityText(task.priority)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Date limite</label>
                <div className="mt-1 flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4" />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : "Aucune date limite"}
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Dernière modification</label>
                <div className="mt-1 text-gray-700 text-sm">
                  {new Date(task.updatedAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="Supprimer la tâche"
        description={`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default TaskDetail;


import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, Clock, AlertCircle, CheckCircle, Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskService } from "@/services/api"

const MyTasks = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { data: tasksData, isLoading, error: fetchError } = useQuery({
    queryKey: ['myTasks'],
    queryFn: async () => {
      const response = await taskService.getMyTasks(); // response.data contient { success, count, data: tasksArray }
      return response.data.data || []; // Accéder à la propriété 'data' qui contient le tableau des tâches
    },
    // staleTime: 5 * 60 * 1000, // Optionnel: garder les données fraîches pendant 5 minutes
  });

  const tasks = tasksData || [];

  const deleteMutation = useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      toast.success("Tâche supprimée avec succès !");
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de la tâche");
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    },
  });

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete?._id) {
      deleteMutation.mutate(taskToDelete._id);
    }
  };

  if (fetchError) {
    toast.error(fetchError.response?.data?.message || "Erreur lors de la récupération des tâches.");
    // Vous pourriez vouloir afficher un message d'erreur plus persistant ici
  }

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'en attente': { label: 'À faire', icon: Clock, className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300' },
      'en cours': { label: 'En cours', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300' },
      'terminée': { label: 'Terminée', icon: CheckCircle, className: 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300' }
    };
    const config = statusConfig[statut] || statusConfig['en attente'];
    const IconComponent = config.icon;
    return (
      <Badge className={`flex items-center gap-1.5 py-1 px-2.5 border-transparent ${config.className}`}>
        <IconComponent className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priorite) => {
    const priorityConfig = {
      'basse': { label: 'Faible', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-300' },
      'moyenne': { label: 'Moyenne', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300' },
      'haute': { label: 'Élevée', className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-300' }
    };
    const config = priorityConfig[priorite] || priorityConfig['moyenne'];
    return (
      <Badge className={`flex items-center gap-1.5 py-1 px-2.5 border-transparent ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-gray-900 dark:text-white">
            <h1 className="text-2xl md:text-3xl font-bold ">Mes Tâches</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
              Gérez et organisez toutes vos tâches
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
            <Link to="/app/tasks/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Link>
          </Button>
        </div>

        {/* Filtres */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en attente">À faire</SelectItem>
                  <SelectItem value="en cours">En cours</SelectItem>
                  <SelectItem value="terminée">Terminée</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="basse">Faible</SelectItem>
                  <SelectItem value="moyenne">Moyenne</SelectItem>
                  <SelectItem value="haute">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des tâches */}
        {isLoading ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">Chargement des tâches...</p>
            </CardContent>
          </Card>
        ) : tasks.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aucune tâche</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Vous n'avez pas encore de tâches. Créez votre première tâche pour commencer à organiser votre travail.
                </p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/app/tasks/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer ma première tâche
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks
              .filter(task => {
                const searchTermLower = searchTerm.toLowerCase();
                const matchesSearch = task.titre.toLowerCase().includes(searchTermLower) || (task.description && task.description.toLowerCase().includes(searchTermLower));
                const matchesStatus = filterStatus === 'all' || task.statut === filterStatus;
                const matchesPriority = filterPriority === 'all' || task.priorité === filterPriority;
                return matchesSearch && matchesStatus && matchesPriority;
              })
              .map((task) => (
              <Card 
                key={task._id} 
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group cursor-pointer"
              >
                <CardHeader className="pb-3 relative">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {task.titre}
                    </CardTitle>
                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        <Link to={`/app/tasks/${task._id}/edit`}>
                          <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(task.statut)}
                    {getPriorityBadge(task.priorité)}
                  </div>

                  {task.dateEcheance && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>
                        Échéance: {new Date(task.dateEcheance).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200">
                      <Link to={`/app/tasks/${task._id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Supprimer la tâche"
          description={`Êtes-vous sûr de vouloir supprimer la tâche "${taskToDelete?.titre}" ? Cette action est irréversible.`}
        />
      </div>
    </div>
  );
};
export default MyTasks
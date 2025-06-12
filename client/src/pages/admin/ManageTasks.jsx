import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Ajout de Link pour la navigation
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  ListChecks, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Users, // Ajouté pour l'icône utilisateurs
  Filter,
  Loader2 // Ajouté
} from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { taskService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ManageTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const queryClient = useQueryClient();

  // Récupération des tâches depuis l'API
  const { data: tasksData, isLoading, isError, error: fetchError } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: async () => {
      const response = await taskService.getAllTasks();
      return response.data.data || []; // L'API renvoie les tâches dans response.data.data
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la récupération des tâches.");
    }
  });

  const tasks = tasksData || [];

  const deleteMutation = useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
      toast.success("Tâche supprimée avec succès !");
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de la tâche.");
    }
  });

  const filteredTasks = tasks.filter(task => { // Utiliser les noms de champs du backend
    const matchesSearch = task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.utilisateur?.fullname && task.utilisateur.fullname.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || task.statut === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priorité === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete?._id) { // Utiliser _id
      deleteMutation.mutate(taskToDelete._id);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.statut === 'terminée').length,
      inProgress: tasks.filter(t => t.statut === 'en cours').length,
      todo: tasks.filter(t => t.statut === 'en attente').length,
      overdue: tasks.filter(t => t.dateEcheance && new Date(t.dateEcheance) < new Date() && t.statut !== 'terminée').length
    };
  };

  const stats = getTaskStats();

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="text-gray-600 dark:text-gray-300">Chargement des tâches...</p>
        {/* Skeleton amélioré */}
        {/* <div className="animate-pulse w-full max-w-5xl">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div> */}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestion des tâches</h1>
        </div>
        <Link to="/app/admin/users">
          <Button variant="outline" className="flex items-center gap-2"><Users className="h-4 w-4" /> Voir les utilisateurs</Button>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">Vue d'ensemble et gestion de toutes les tâches de la plateforme.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À faire</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.todo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <CardTitle>Liste des tâches</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-72 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tâche</TableHead>
                <TableHead>Assignée à</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Date limite</TableHead>
                <TableHead>Créée le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">{task.titre}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getInitials(task.utilisateur?.fullname || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{task.utilisateur?.fullname || 'Utilisateur inconnu'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.statut)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(task.priorité)}
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm ${new Date(task.dateEcheance) < new Date() && task.statut !== 'terminée' ? 'text-red-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                      {task.dateEcheance ? new Date(task.dateEcheance).toLocaleDateString('fr-FR') : '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <ListChecks className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune tâche trouvée</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Essayez de modifier vos filtres de recherche" 
                  : "Il n'y a aucune tâche pour le moment"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageTasks

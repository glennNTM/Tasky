
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, Clock, AlertCircle, CheckCircle, Edit, Trash2 } from "lucide-react";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { toast } from "sonner";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      console.log(`DELETE /api/tasks/${taskToDelete.id}`);
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      toast.success("Tâche supprimée avec succès !");
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'todo': { label: 'À faire', variant: 'outline', icon: Clock },
      'in-progress': { label: 'En cours', variant: 'default', icon: AlertCircle },
      'completed': { label: 'Terminée', variant: 'secondary', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig['todo'];
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { label: 'Faible', className: 'bg-green-100 text-green-800' },
      'medium': { label: 'Moyenne', className: 'bg-yellow-100 text-yellow-800' },
      'high': { label: 'Élevée', className: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['medium'];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Tâches</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Gérez et organisez toutes vos tâches
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/app/tasks/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Link>
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des tâches */}
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Aucune tâche</h3>
                <p className="text-gray-600 max-w-md">
                  Vous n'avez pas encore de tâches. Créez votre première tâche pour commencer à organiser votre travail.
                </p>
                <Button asChild>
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
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <Link to={`/app/tasks/${task.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/app/tasks/${task.id}`}>
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
          description={`Êtes-vous sûr de vouloir supprimer la tâche "${taskToDelete?.title}" ? Cette action est irréversible.`}
        />
      </div>
    </div>
  );
};

export default MyTasks;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  ListChecks, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { userService, taskService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('user'); // 'user' or 'task'

  // Requêtes pour récupérer les données
  const { data: users = [], isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers().then(res => res.data),
  });

  const { data: tasks = [], isLoading: loadingTasks, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getAllTasks().then(res => res.data),
  });

  const handleDeleteUser = (user) => {
    setItemToDelete(user);
    setDeleteType('user');
    setDeleteModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setItemToDelete(task);
    setDeleteType('task');
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'user') {
        await userService.deleteUser(itemToDelete.id);
        toast.success(`Utilisateur "${itemToDelete.name}" supprimé avec succès !`);
        refetchUsers();
      } else {
        await taskService.deleteTask(itemToDelete.id);
        toast.success(`Tâche "${itemToDelete.title}" supprimée avec succès !`);
        refetchTasks();
      }
      
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(`Erreur lors de la suppression ${deleteType === 'user' ? 'de l\'utilisateur' : 'de la tâche'}`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'in-progress': return <AlertCircle className="h-3 w-3" />;
      case 'todo': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
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

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'user': return 'Utilisateur';
      default: return 'Utilisateur';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
    };
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      users: users.filter(u => u.role === 'user').length,
      active: users.filter(u => u.isActive).length,
    };
  };

  const taskStats = getTaskStats();
  const userStats = getUserStats();

  if (loadingUsers || loadingTasks) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord administrateur</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Vue d'ensemble et gestion de la plateforme.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.admins} admin(s), {userStats.users} utilisateur(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches totales</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completed} terminées, {taskStats.inProgress} en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.todo} à faire
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour les utilisateurs et tâches */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-green-600 text-white text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                          {user.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          {getRoleText(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/app/admin/users/${user.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-600 dark:text-gray-300">Il n'y a aucun utilisateur pour le moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des tâches</CardTitle>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {getInitials(task.user?.name || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{task.user?.name || 'Utilisateur inconnu'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(task.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(task.status)}
                          {getStatusText(task.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(task.priority)} w-fit`}>
                          {getPriorityText(task.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}`}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : 'Non définie'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/app/tasks/${task.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTask(task)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <ListChecks className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune tâche trouvée</h3>
                  <p className="text-gray-600 dark:text-gray-300">Il n'y a aucune tâche pour le moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title={`Supprimer ${deleteType === 'user' ? 'l\'utilisateur' : 'la tâche'}`}
        description={
          itemToDelete 
            ? `Êtes-vous sûr de vouloir supprimer ${deleteType === 'user' ? `l'utilisateur "${itemToDelete.name}"` : `la tâche "${itemToDelete.title}"`} ? Cette action est irréversible.`
            : ""
        }
      />
    </div>
  );
};

export default Dashboard;

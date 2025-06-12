
import { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Ajout de Link pour la navigation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Users, 
  Edit, 
  Trash2,
  Calendar,
  Shield, // Icône pour rôle utilisateur
  ListChecks, // Icône pour tâches
  Brain,
  Loader2,
  Mail // Ajouté pour l'icône email
} from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { userService } from "@/services/api";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data: usersData, isLoading: isLoadingUsers, isError: isUsersError, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      return response.data.data || []; // L'API renvoie les utilisateurs dans response.data.data
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la récupération des utilisateurs.");
    }
  });

  const users = usersData || [];

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("Utilisateur supprimé avec succès !");
      setDeleteModalOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de l'utilisateur.");
    }
  });

  const filteredUsers = useMemo(() => users.filter(user =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [users, searchTerm]);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete?._id) {
      deleteUserMutation.mutate(userToDelete._id);
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

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300' 
                             : 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300';
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <Brain className="h-3 w-3" /> : <Shield className="h-3 w-3" />;
  };

  const getRoleText = (role) => {
    // Le rôle 'tasker' est l'équivalent de 'Utilisateur' dans l'affichage
    return role === 'admin' ? 'Administrateur' : 'Utilisateur'; 
  };

  if (isLoadingUsers) {
    return (
      <div className="p-6 space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
        <p className="text-gray-600 dark:text-gray-300">Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (isUsersError) {
    return (
      <div className="p-6 space-y-6 text-center">
        <p className="text-red-500">{usersError?.response?.data?.message || "Une erreur est survenue."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</h1>
        </div>
        <Link to="/app/admin/tasks">
          <Button variant="outline" className="flex items-center gap-2"> <ListChecks className="h-4 w-4" /> Voir les tâches</Button>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">Gérez les comptes utilisateurs et leurs permissions.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            {/* <p className="text-xs text-muted-foreground">
              +2 cette semaine
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === 'admin').length}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              Accès complet
            </p> */}
          </CardContent>
        </Card>
      </div>

      {/* Recherche et tableau */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Liste des utilisateurs</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                {/* <TableHead>Tâches</TableHead> */}
                <TableHead>Inscription</TableHead>
                {/* <TableHead>Dernière activité</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'} text-white text-sm`}>
                          {getInitials(user.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.fullname}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="dark:text-gray-400">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                      {getRoleIcon(user.role)}
                      {getRoleText(user.role)}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>
                    <span className="font-medium">{user.tasksCount}</span>
                  </TableCell> */}
                  <TableCell>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <div className="text-sm">
                      {new Date(user.lastActive).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Le bouton Edit nécessiterait un modal/page de formulaire pour la modification */}
                      {/* <Button variant="ghost" size="sm" onClick={() => console.log("Edit user", user._id)}>
                        <Edit className="h-4 w-4" />
                      </Button> */}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm ? "Essayez de modifier votre recherche." : "Il n'y a aucun utilisateur pour le moment."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'utilisateur"
        description={
          userToDelete 
            ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete.fullname}" ? Cette action est irréversible.`
            : ""
        }
        isDeleting={deleteUserMutation.isPending}
      />
    </div>
  );
};

export default ManageUsers;

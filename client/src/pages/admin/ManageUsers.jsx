
import { useState } from "react";
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
  Mail, 
  Calendar,
  Shield,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Données de démonstration
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@example.com",
      role: "admin",
      joinedDate: "2024-01-15",
      tasksCount: 12,
      lastActive: "2024-01-20"
    },
    {
      id: 2,
      name: "Pierre Martin",
      email: "pierre.martin@example.com",
      role: "user",
      joinedDate: "2024-01-18",
      tasksCount: 8,
      lastActive: "2024-01-19"
    },
    {
      id: 3,
      name: "Julie Leroy",
      email: "julie.leroy@example.com",
      role: "user",
      joinedDate: "2024-01-20",
      tasksCount: 15,
      lastActive: "2024-01-20"
    },
    {
      id: 4,
      name: "Thomas Roux",
      email: "thomas.roux@example.com",
      role: "user",
      joinedDate: "2024-01-12",
      tasksCount: 6,
      lastActive: "2024-01-18"
    },
    {
      id: 5,
      name: "Sophie Chen",
      email: "sophie.chen@example.com",
      role: "admin",
      joinedDate: "2024-01-10",
      tasksCount: 23,
      lastActive: "2024-01-20"
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Simulation d'appel API
      console.log(`DELETE /api/users/${userToDelete.id}`);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour la liste des utilisateurs
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast.success(`Utilisateur ${userToDelete.name} supprimé avec succès !`);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />;
  };

  const getRoleText = (role) => {
    return role === 'admin' ? 'Administrateur' : 'Utilisateur';
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-gray-600 mt-2">Gérez les comptes utilisateurs et leurs permissions.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Accès complet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => new Date(user.lastActive) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et tableau */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Liste des utilisateurs</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
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
                <TableHead>Tâches</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
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
                  <TableCell>
                    <span className="font-medium">{user.tasksCount}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(user.joinedDate).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(user.lastActive).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600">
                {searchTerm ? "Essayez de modifier votre recherche" : "Il n'y a aucun utilisateur pour le moment"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Supprimer l'utilisateur"
        description={
          userToDelete 
            ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete.name}" ? Cette action supprimera également toutes ses tâches et est irréversible.`
            : ""
        }
      />
    </div>
  );
};

export default ManageUsers;

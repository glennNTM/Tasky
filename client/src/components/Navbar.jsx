
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    try {
      console.log("POST /api/auth/signout");
      
      localStorage.removeItem('user');
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
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

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-green-600 p-2 rounded-lg mr-3">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Tasky</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Bouton de thème */}
          <ThemeToggle />

          {/* Profil utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* Utiliser user.profilePictureUrl si disponible, sinon initiales */}
                  {/* <AvatarImage src={user.profilePictureUrl} alt={user.fullname} /> */}
                  <AvatarFallback className="bg-green-600 text-white">{getInitials(user.fullname)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">{user.fullname}</p>
                  <p className="text-xs leading-none text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={() => navigate(`/app/profile/${user._id}`)} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                <User className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-white">Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-gray-900 dark:text-white">Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

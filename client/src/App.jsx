
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Layout from "./pages/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OAuthCallback from "./pages/auth/OAuthCallback";
// import Home from "./pages/Home"; // Home n'est plus utilisé pour /app index
import MyTasks from "./pages/tasks/MyTasks";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";
import TaskDetail from "./pages/tasks/TaskDetail";
import Profile from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTasks from "./pages/admin/ManageTasks";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirection de / vers /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Routes d'authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback/:provider" element={<OAuthCallback />} />

            {/* Routes protégées */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<MyTasks />} /> {/* MyTasks est maintenant la page d'accueil de /app */}
              <Route path="tasks/create" element={<CreateTask />} />
              {/* L'ancienne route /app/tasks peut être supprimée ou redirigée si MyTasks est à l'index */}
              {/* <Route path="tasks" element={<Navigate to="/app" replace />} /> */} 
              <Route path="tasks/:id" element={<TaskDetail />} />
              <Route path="tasks/:id/edit" element={<EditTask />} />
              <Route path="profile/:id" element={<Profile />} />
              
              {/* Routes admin */}
              <Route path="admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
              <Route path="admin/tasks" element={<AdminRoute><ManageTasks /></AdminRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

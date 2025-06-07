
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  ListChecks,
  Plus,
  User,
  Settings,
  Users,
  BarChart3
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const mainItems = [
    { title: "Tableau de bord", url: "/app", icon: Home },
    { title: "Mes tâches", url: "/app/tasks", icon: ListChecks },
    { title: "Créer une tâche", url: "/app/tasks/create", icon: Plus },
    { title: "Profil", url: "/app/profile", icon: User },
  ];

  const adminItems = [
    { title: "Dashboard Admin", url: "/app/admin", icon: BarChart3 },
    { title: "Gérer les utilisateurs", url: "/app/admin/users", icon: Users },
    { title: "Gérer les tâches", url: "/app/admin/tasks", icon: Settings },
  ];

  const isActive = (path) => currentPath === path;
  const getNavCls = ({ isActive }) =>
    isActive 
      ? "bg-primary text-white font-medium hover:bg-primary/90" 
      : "hover:bg-gray-100 text-gray-700";

  // Simuler le rôle admin (pour les tests)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible>
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="bg-primary p-2 rounded-lg">
            <ListChecks className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 text-xl font-bold text-secondary">Tasky</span>
          )}
        </div>
      </div>

      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/app"}
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/app/admin"}
                        className={getNavCls}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

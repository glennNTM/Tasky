
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Clock, AlertCircle, CheckCircle, Calendar, Edit, Trash2 } from "lucide-react";

const DashboardTabs = () => {
  const [tasks] = useState([]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'todo': { 
        label: 'À faire', 
        variant: 'outline', 
        icon: Clock, 
        color: 'text-amber-600',
        bgColor: 'bg-amber-100 dark:bg-amber-900'
      },
      'in-progress': { 
        label: 'En cours', 
        variant: 'default', 
        icon: AlertCircle, 
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900'
      },
      'completed': { 
        label: 'Terminée', 
        variant: 'secondary', 
        icon: CheckCircle, 
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900'
      }
    };
    
    const config = statusConfig[status] || statusConfig['todo'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`flex items-center gap-1 ${config.bgColor} ${config.color} border-0`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { label: 'Faible', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      'medium': { label: 'Moyenne', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
      'high': { label: 'Élevée', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['medium'];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Mes Tâches</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base">
              Organisez et gérez vos tâches efficacement
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
            <Link to="/app/tasks/create">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle tâche
            </Link>
          </Button>
        </div>

        {/* Navigation par onglets */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300">Toutes</TabsTrigger>
            <TabsTrigger value="todo" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300">À faire</TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300">En cours</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300">Terminées</TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          {['all', 'todo', 'in-progress', 'completed'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-6 mt-6">
              {tasks.length === 0 ? (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="text-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <CheckCircle className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Aucune tâche</h3>
                      <p className="text-gray-600 dark:text-gray-300 max-w-md">
                        Vous n'avez pas encore de tâches. Créez votre première tâche pour commencer à organiser votre travail.
                      </p>
                      <Button asChild className="bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
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
                    <Card 
                      key={task.id} 
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group cursor-pointer"
                    >
                      <CardHeader className="pb-3 relative">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg line-clamp-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {task.title}
                          </CardTitle>
                          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                            >
                              <Link to={`/app/tasks/${task.id}/edit`}>
                                <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>

                        {task.dueDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span>
                              Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}

                        <div className="pt-2">
                          <Button asChild variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200">
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardTabs;

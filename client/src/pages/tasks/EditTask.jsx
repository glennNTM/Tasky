
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: ""
  });

  useEffect(() => {
    const loadTask = async () => {
      try {
        console.log(`GET /api/tasks/${id}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockTask = {
          id: parseInt(id),
          title: "Tâche d'exemple",
          description: "Description de la tâche",
          status: "todo",
          priority: "medium",
          dueDate: "2024-12-15"
        };
        
        setFormData(mockTask);
      } catch (error) {
        toast.error("Erreur lors du chargement de la tâche");
        navigate("/app");
      }
    };

    if (id) {
      loadTask();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log(`PUT /api/tasks/${id}`, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Tâche modifiée avec succès !");
      navigate("/app");
    } catch (error) {
      toast.error("Erreur lors de la modification de la tâche");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusIcon = (status) => {
    const icons = {
      'todo': <Clock className="h-4 w-4 text-amber-600" />,
      'in-progress': <AlertCircle className="h-4 w-4 text-blue-600" />,
      'completed': <CheckCircle className="h-4 w-4 text-green-600" />
    };
    return icons[status];
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier la tâche</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Modifiez les informations de votre tâche.</p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Informations de la tâche</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-gray-900 dark:text-white">Titre de la tâche</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Entrez le titre de la tâche"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Décrivez votre tâche..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status" className="text-gray-900 dark:text-white flex items-center gap-2">
                    {getStatusIcon(formData.status)}
                    Statut
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          À faire
                        </div>
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          En cours
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Terminée
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-gray-900 dark:text-white">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Date d'échéance
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Sauvegarder
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/app")}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTask;

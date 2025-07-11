import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Plus, Edit, Eye, Building } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

export default function ProjectManagement() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    clientName: "",
    projectType: "",
    startDate: "",
    endDate: "",
    status: "active"
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (!isLoading && user && user.role !== 'advanced') {
      toast({
        title: "Acesso Negado",
        description: "Esta funcionalidade é exclusiva para gerentes e diretores.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [user, isLoading, toast]);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
    enabled: !!user && user.role === 'advanced',
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return false;
      }
      return failureCount < 3;
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      return await apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Projeto Criado",
        description: "Projeto criado com sucesso!",
      });
      setIsCreateDialogOpen(false);
      setNewProject({
        name: "",
        description: "",
        clientName: "",
        projectType: "",
        startDate: "",
        endDate: "",
        status: "active"
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Erro ao criar projeto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.clientName || !newProject.projectType) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, cliente e tipo do projeto.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate(newProject);
  };

  const projectTypes = [
    { value: "SOX", label: "SOX" },
    { value: "LGPD", label: "LGPD" },
    { value: "Auditoria", label: "Auditoria" },
    { value: "Consultoria", label: "Consultoria" },
    { value: "VAR", label: "VAR" },
    { value: "BPO", label: "BPO" }
  ];

  const statusOptions = [
    { value: "active", label: "Ativo", color: "bg-green-100 text-green-800" },
    { value: "completed", label: "Concluído", color: "bg-blue-100 text-blue-800" },
    { value: "paused", label: "Pausado", color: "bg-yellow-100 text-yellow-800" }
  ];

  if (isLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'advanced') {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro de Projetos</h2>
            <p className="text-gray-600">Gerencie projetos GRC e suas informações</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Projeto *</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Ex: Projeto SOX - Empresa"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clientName">Cliente *</Label>
                  <Input
                    id="clientName"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectType">Tipo do Projeto *</Label>
                  <Select value={newProject.projectType} onValueChange={(value) => setNewProject({...newProject, projectType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newProject.status} onValueChange={(value) => setNewProject({...newProject, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Descrição do projeto..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createProjectMutation.isPending ? "Criando..." : "Criar Projeto"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                <p className="text-3xl font-bold text-gray-900">{projects?.length || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects?.filter(p => p.status === 'active').length || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FolderKanban className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(projects?.map(p => p.clientName)).size || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects?.filter(p => p.status === 'completed').length || 0}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <FolderKanban className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Projeto</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Período</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((project) => {
                  const status = statusOptions.find(s => s.value === project.status);
                  return (
                    <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{project.name}</p>
                          {project.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{project.clientName}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{project.projectType}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {project.startDate && project.endDate ? (
                          <>
                            {new Date(project.startDate).toLocaleDateString('pt-BR')} - {new Date(project.endDate).toLocaleDateString('pt-BR')}
                          </>
                        ) : project.startDate ? (
                          <>Início: {new Date(project.startDate).toLocaleDateString('pt-BR')}</>
                        ) : (
                          'Não definido'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={status?.color || 'bg-gray-100 text-gray-800'}>
                          {status?.label || project.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {(!projects || projects.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                Nenhum projeto cadastrado ainda.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Eye, UserCheck, UserX, Download } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User } from "@shared/schema";

export default function TeamManagement() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProfessional, setNewProfessional] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "basic",
    position: "",
    department: "",
    isActive: true
  });

  // Fetch users from API
  const { data: professionals = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user && user.role === 'advanced',
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Usuário criado",
        description: "Novo profissional adicionado com sucesso.",
      });
      setIsCreateDialogOpen(false);
      setNewProfessional({
        firstName: "",
        lastName: "",
        email: "",
        role: "basic",
        position: "",
        department: "",
        isActive: true
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
        description: "Não foi possível criar o usuário.",
        variant: "destructive",
      });
    },
  });

  // Mock data for testing (remove once API is working)
  const mockProfessionals = [
    {
      id: "1",
      firstName: "João",
      lastName: "Santos",
      email: "joao.santos@vennx.com.br",
      role: "advanced",
      position: "Gerente de Projetos",
      department: "GRC",
      isActive: true,
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      id: "2",
      firstName: "Ana",
      lastName: "Costa",
      email: "ana.costa@vennx.com.br",
      role: "basic",
      position: "Analista GRC",
      department: "Auditoria",
      isActive: true,
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      id: "3",
      firstName: "Carlos",
      lastName: "Oliveira",
      email: "carlos.oliveira@vennx.com.br",
      role: "basic",
      position: "Especialista SOX",
      department: "Compliance",
      isActive: true,
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      id: "4",
      firstName: "Maria",
      lastName: "Silva",
      email: "maria.silva@vennx.com.br",
      role: "basic",
      position: "Consultora LGPD",
      department: "Privacidade",
      isActive: false,
      profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    }
  ];

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

  const handleCreateProfessional = () => {
    if (!newProfessional.firstName || !newProfessional.lastName || !newProfessional.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, sobrenome e email.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement API call
    toast({
      title: "Profissional Cadastrado",
      description: "Profissional cadastrado com sucesso!",
    });
    setIsCreateDialogOpen(false);
    setNewProfessional({
      firstName: "",
      lastName: "",
      email: "",
      role: "basic",
      position: "",
      department: "",
      isActive: true
    });
  };

  const roles = [
    { value: "basic", label: "Profissional" },
    { value: "advanced", label: "Gerente/Diretor" }
  ];

  const departments = [
    { value: "GRC", label: "GRC" },
    { value: "Auditoria", label: "Auditoria" },
    { value: "Compliance", label: "Compliance" },
    { value: "Privacidade", label: "Privacidade" },
    { value: "Tecnologia", label: "Tecnologia" },
    { value: "Consultoria", label: "Consultoria" }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando equipe...</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro de Profissionais</h2>
            <p className="text-gray-600">Gerencie a equipe e suas permissões no sistema</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Profissional</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={newProfessional.firstName}
                    onChange={(e) => setNewProfessional({...newProfessional, firstName: e.target.value})}
                    placeholder="Nome do profissional"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={newProfessional.lastName}
                    onChange={(e) => setNewProfessional({...newProfessional, lastName: e.target.value})}
                    placeholder="Sobrenome"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newProfessional.email}
                    onChange={(e) => setNewProfessional({...newProfessional, email: e.target.value})}
                    placeholder="email@vennx.com.br"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Perfil de Acesso</Label>
                  <Select value={newProfessional.role} onValueChange={(value) => setNewProfessional({...newProfessional, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={newProfessional.position}
                    onChange={(e) => setNewProfessional({...newProfessional, position: e.target.value})}
                    placeholder="Ex: Analista GRC"
                  />
                </div>
                
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={newProfessional.department} onValueChange={(value) => setNewProfessional({...newProfessional, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateProfessional}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Cadastrar Profissional
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
                <p className="text-sm font-medium text-gray-600">Total de Profissionais</p>
                <p className="text-3xl font-bold text-gray-900">{professionals.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profissionais Ativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {professionals.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gerentes/Diretores</p>
                <p className="text-3xl font-bold text-gray-900">
                  {professionals.filter(p => p.role === 'advanced' && p.isActive).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {professionals.filter(p => !p.isActive).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Profissionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Cargo</th>
                  <th className="px-6 py-3">Departamento</th>
                  <th className="px-6 py-3">Perfil</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((professional) => (
                  <tr key={professional.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={professional.profileImageUrl} 
                          alt={`${professional.firstName} ${professional.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {professional.firstName} {professional.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{professional.email}</td>
                    <td className="px-6 py-4 text-gray-900">{professional.position}</td>
                    <td className="px-6 py-4 text-gray-900">{professional.department}</td>
                    <td className="px-6 py-4">
                      <Badge variant={professional.role === 'advanced' ? 'default' : 'outline'}>
                        {professional.role === 'advanced' ? 'Gerente/Diretor' : 'Profissional'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={professional.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {professional.isActive ? 'Ativo' : 'Inativo'}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
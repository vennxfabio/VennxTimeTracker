import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, FileSpreadsheet, Database, Users, Shield, Calendar, Download } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Administration() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

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

  // Backup mutation
  const backupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/backup/database", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup criado",
        description: "Backup do banco de dados baixado com sucesso.",
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
        title: "Erro no backup",
        description: "Não foi possível criar o backup.",
        variant: "destructive",
      });
    },
  });

  // Export mutations
  const exportPlannedHours = useMutation({
    mutationFn: async () => {
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";
      const response = await fetch(`/api/export/planned-hours?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Relatório exportado",
        description: "Horas planejadas exportadas com sucesso.",
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
        title: "Erro na exportação",
        description: "Não foi possível exportar as horas planejadas.",
        variant: "destructive",
      });
    },
  });

  const exportIncurredHours = useMutation({
    mutationFn: async () => {
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";
      const response = await fetch(`/api/export/incurred-hours?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Relatório exportado",
        description: "Horas incorridas exportadas com sucesso.",
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
        title: "Erro na exportação",
        description: "Não foi possível exportar as horas incorridas.",
        variant: "destructive",
      });
    },
  });

  const exportAllocation = useMutation({
    mutationFn: async () => {
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";
      const response = await fetch(`/api/export/allocation?startDate=${startDate}&endDate=${endDate}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Relatório exportado",
        description: "Alocação de profissionais exportada com sucesso.",
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
        title: "Erro na exportação",
        description: "Não foi possível exportar a alocação de profissionais.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando administração...</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Administração</h2>
        <p className="text-gray-600">Configurações avançadas e relatórios do sistema</p>
      </div>

      {/* Export Reports Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5" />
              <span>Relatórios Excel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Exporte relatórios detalhados para análise externa e auditoria
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-50 h-20"
                onClick={() => exportPlannedHours.mutate()}
                disabled={exportPlannedHours.isPending}
              >
                <div className="text-center">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Horas Planejadas</span>
                  <p className="text-xs text-gray-500">Por mês ou período</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-50 h-20"
                onClick={() => exportIncurredHours.mutate()}
                disabled={exportIncurredHours.isPending}
              >
                <div className="text-center">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Horas Incorridas</span>
                  <p className="text-xs text-gray-500">Por mês ou período</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-50 h-20"
                onClick={() => exportAllocation.mutate()}
                disabled={exportAllocation.isPending}
              >
                <div className="text-center">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Alocação por Período</span>
                  <p className="text-xs text-gray-500">Análise de produtividade</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Administration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Gestão de Usuários</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Gerencie permissões e acesso de usuários ao sistema
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Configurar Permissões
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Relatório de Acesso
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Backup e Manutenção</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ferramentas para manutenção e backup do sistema
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => backupMutation.mutate()}
                disabled={backupMutation.isPending}
              >
                <Database className="w-4 h-4 mr-2" />
                {backupMutation.isPending ? "Criando Backup..." : "Backup Manual"}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Configurações do Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Configurações Avançadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Configurações de Tempo</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Mínimo de horas diárias</span>
                  <span className="text-sm font-medium text-gray-900">8 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Máximo de horas diárias</span>
                  <span className="text-sm font-medium text-gray-900">24 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Aprovação automática</span>
                  <span className="text-sm font-medium text-gray-900">Desabilitada</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notificações</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Email de lembrete</span>
                  <span className="text-sm font-medium text-gray-900">Habilitado</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Notificação de desvios</span>
                  <span className="text-sm font-medium text-gray-900">Habilitado</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Relatório mensal</span>
                  <span className="text-sm font-medium text-gray-900">Automático</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Sistema de Auditoria</h4>
                <p className="text-sm text-gray-600">Registros de todas as operações do sistema</p>
              </div>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
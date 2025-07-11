import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import KpiCards from "@/components/dashboard/kpi-cards";
import EnhancedCharts from "@/components/dashboard/enhanced-charts";
import TopPerformers from "@/components/dashboard/top-performers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, BarChart3, Clock } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Basic users see personal dashboard with individual indicators
  if (user.role === 'basic') {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Minha Área Pessoal</h2>
          <p className="text-gray-600">Acompanhe sua alocação, programação e débito de horas</p>
        </div>

        {/* Personal KPIs for Basic Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Meu Percentual de Alocação</p>
                  <p className="text-3xl font-bold text-gray-900">92%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-sm text-green-600 font-medium mt-2 block">Meta: 85% - Superada!</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Minha Programação</p>
                  <p className="text-3xl font-bold text-gray-900">168h</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600 font-medium">Janeiro 2025 - Planejado</span>
                <div className="text-xs text-gray-500 mt-1">
                  21 dias úteis × 8h
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Meu Débito de Horas</p>
                  <p className="text-3xl font-bold text-gray-900">+4h</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600 font-medium">Saldo positivo este mês</span>
                <div className="text-xs text-gray-500 mt-1">
                  172h trabalhadas / 168h planejadas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lançamento de Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Registre suas horas trabalhadas por projeto e período
              </p>
              <Button 
                onClick={() => window.location.href = "/time-entry"}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Acessar Lançamento de Horas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Segunda-feira</span>
                  <span className="text-sm font-medium text-green-600">8h ✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Terça-feira</span>
                  <span className="text-sm font-medium text-green-600">8.5h ✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quarta-feira</span>
                  <span className="text-sm font-medium text-green-600">8h ✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quinta-feira</span>
                  <span className="text-sm font-medium text-red-600">6h ⚠</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sexta-feira</span>
                  <span className="text-sm font-medium text-gray-400">Pendente</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Total da semana:</span>
                    <span className="text-sm font-bold text-gray-900">30.5h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Advanced users see the full executive dashboard
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Executivo</h2>
        <p className="text-gray-600">Visão geral dos indicadores de alocação e performance da equipe</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <KpiCards />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <EnhancedCharts />
      </div>

      {/* Top Performers */}
      <div className="mb-8">
        <TopPerformers />
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5" />
            <span>Relatórios Excel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => {
                // TODO: Implement export functionality
                toast({
                  title: "Exportando relatório",
                  description: "Horas planejadas - funcionalidade em desenvolvimento",
                });
              }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Horas Planejadas</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => {
                toast({
                  title: "Exportando relatório",
                  description: "Horas incorridas - funcionalidade em desenvolvimento",
                });
              }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Horas Incorridas</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2 border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => {
                toast({
                  title: "Exportando relatório",
                  description: "Alocação por período - funcionalidade em desenvolvimento",
                });
              }}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Alocação por Período</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

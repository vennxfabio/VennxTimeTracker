import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Plus } from "lucide-react";

export default function ResourcePlanning() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando programação de recursos...</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Programação de Recursos</h2>
        <p className="text-gray-600">Planeje e acompanhe a alocação de profissionais por projeto</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profissionais Ativos</p>
                <p className="text-3xl font-bold text-gray-900">28</p>
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
                <p className="text-sm font-medium text-gray-600">Horas Planejadas (Mês)</p>
                <p className="text-3xl font-bold text-gray-900">5,440h</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Ocupação</p>
                <p className="text-3xl font-bold text-gray-900">87%</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Planejamento por Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Defina as horas planejadas por profissional em cada projeto
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Planejamento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programação de Férias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Gerencie e aprove as programações de férias da equipe
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              Programar Férias
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Planned Hours Table */}
      <Card>
        <CardHeader>
          <CardTitle>Horas Planejadas - Janeiro 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Profissional</th>
                  <th className="px-6 py-3">Projeto</th>
                  <th className="px-6 py-3">Período</th>
                  <th className="px-6 py-3">Horas Planejadas</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">João Santos</td>
                  <td className="px-6 py-4">Projeto SOX - Ipiranga</td>
                  <td className="px-6 py-4">01/01 - 31/01</td>
                  <td className="px-6 py-4">160h</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">Ana Costa</td>
                  <td className="px-6 py-4">LGPD - Afya</td>
                  <td className="px-6 py-4">01/01 - 15/01</td>
                  <td className="px-6 py-4">80h</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900">Carlos Oliveira</td>
                  <td className="px-6 py-4">Férias</td>
                  <td className="px-6 py-4">15/01 - 31/01</td>
                  <td className="px-6 py-4">0h</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Férias
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Ver Detalhes</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
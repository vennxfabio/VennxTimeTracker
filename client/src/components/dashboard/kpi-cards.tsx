import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, FolderKanban, Scale } from "lucide-react";

export default function KpiCards() {
  // Mock data for now - in a real app this would come from API
  const kpiData = {
    generalAllocation: 87,
    overtimeHours: 342,
    activeProjects: 23,
    averageVariance: -12,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alocação Geral</p>
              <p className="text-3xl font-bold text-gray-900">{kpiData.generalAllocation}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">↗ +2.3% vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Horas Extras</p>
              <p className="text-3xl font-bold text-gray-900">{kpiData.overtimeHours}h</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">↗ +15% vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{kpiData.activeProjects}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">→ Estável</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Desvio Médio</p>
              <p className="text-3xl font-bold text-gray-900">{kpiData.averageVariance}h</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Scale className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">Abaixo do planejado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

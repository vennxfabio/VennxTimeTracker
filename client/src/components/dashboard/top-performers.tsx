import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TopPerformers() {
  // Mock data - in a real app this would come from API
  const topOvertimeUsers = [
    {
      id: 1,
      name: "João Santos",
      position: "Consultor Sênior",
      hours: 58,
      variance: 23,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      id: 2,
      name: "Ana Costa",
      position: "Analista GRC",
      hours: 47,
      variance: 18,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      id: 3,
      name: "Carlos Oliveira",
      position: "Especialista SOX",
      hours: 41,
      variance: 12,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
  ];

  const topVarianceProjects = [
    {
      id: 1,
      name: "Projeto SOX - Ipiranga",
      planned: 320,
      incurred: 387,
      variance: 67,
      percentage: 21
    },
    {
      id: 2,
      name: "Auditoria - Ultrapar",
      planned: 180,
      incurred: 225,
      variance: 45,
      percentage: 25
    },
    {
      id: 3,
      name: "LGPD - Afya",
      planned: 240,
      incurred: 275,
      variance: 35,
      percentage: 15
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top 5 Overtime */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 - Horas Extras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topOvertimeUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.avatar} 
                    alt={`${user.name} photo`} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{user.hours}h</p>
                  <p className="text-xs text-orange-600">+{user.variance}% vs meta</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Project Variance */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 - Maior Desvio por Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topVarianceProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-600">
                    Planejado: {project.planned}h | Incorrido: {project.incurred}h
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">+{project.variance}h</p>
                  <p className="text-xs text-red-600">+{project.percentage}% acima</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

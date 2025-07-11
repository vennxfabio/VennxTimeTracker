import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function EnhancedCharts() {
  // Mock data for charts - in a real app this would come from API
  const allocationData = [
    { month: 'Jul', percentage: 82, total: 1640 },
    { month: 'Ago', percentage: 75, total: 1500 },
    { month: 'Set', percentage: 88, total: 1760 },
    { month: 'Out', percentage: 91, total: 1820 },
    { month: 'Nov', percentage: 85, total: 1700 },
    { month: 'Dez', percentage: 87, total: 1740 },
  ];

  const overtimeData = [
    { month: 'Jul', hours: 245 },
    { month: 'Ago', hours: 312 },
    { month: 'Set', hours: 280 },
    { month: 'Out', hours: 367 },
    { month: 'Nov', hours: 298 },
    { month: 'Dez', hours: 342 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'percentage' ? `${entry.value}%` : `${entry.value}h`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ x, y, width, value, dataKey, payload }: any) => {
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#374151" 
        textAnchor="middle" 
        fontSize="12"
        fontWeight="600"
      >
        {dataKey === 'percentage' ? `${value}% (${payload.total}h)` : `${value}h`}
      </text>
    );
  };

  const CustomLineLabel = ({ x, y, value }: any) => {
    return (
      <text 
        x={x} 
        y={y - 10} 
        fill="#374151" 
        textAnchor="middle" 
        fontSize="12"
        fontWeight="600"
      >
        {value}h
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Allocation Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Alocação Geral</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-xs">3M</Button>
              <Button variant="default" size="sm" className="text-xs bg-blue-600">6M</Button>
              <Button variant="ghost" size="sm" className="text-xs">1A</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-gray-600"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-gray-600"
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="percentage" 
                  fill="#2563eb" 
                  radius={4}
                  label={<CustomLabel />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Overtime Hours Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Horas Extras</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-xs">3M</Button>
              <Button variant="default" size="sm" className="text-xs bg-blue-600">6M</Button>
              <Button variant="ghost" size="sm" className="text-xs">1A</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overtimeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-gray-600"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-gray-600"
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                  label={<CustomLineLabel />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

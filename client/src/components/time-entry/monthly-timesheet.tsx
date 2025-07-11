import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonthlyTimesheetProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

interface TimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  entryType: string;
  hours: number;
}

interface DayEntry {
  date: string;
  entries: TimeEntry[];
  isWorkDay: boolean;
}

export default function MonthlyTimesheet({ selectedMonth, onMonthChange }: MonthlyTimesheetProps) {
  const { toast } = useToast();

  // Mock data for projects
  const projects = [
    { id: "1", name: "Projeto SOX - Ipiranga" },
    { id: "2", name: "Auditoria - Ultrapar" },
    { id: "3", name: "LGPD - Afya" },
    { id: "4", name: "Consultoria GRC - Bristow" },
    { id: "5", name: "VAR - Equinox Gold" }
  ];

  const entryTypes = [
    { value: 'project', label: 'Projeto' },
    { value: 'vacation', label: 'Férias' },
    { value: 'leave', label: 'Licença' },
    { value: 'hour_bank', label: 'Banco de Horas' }
  ];

  // Generate days for the month
  const getDaysInMonth = (date: Date): DayEntry[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: DayEntry[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateString = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();
      const isWorkDay = dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday or Saturday

      days.push({
        date: dateString,
        entries: [
          {
            id: `${dateString}-1`,
            projectId: "",
            projectName: "",
            entryType: "project",
            hours: 0
          }
        ],
        isWorkDay
      });
    }

    return days;
  };

  const [monthlyData, setMonthlyData] = useState<DayEntry[]>(getDaysInMonth(selectedMonth));

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + (direction === 'next' ? 1 : -1));
    onMonthChange(newMonth);
    setMonthlyData(getDaysInMonth(newMonth));
  };

  const updateEntry = (dayIndex: number, entryIndex: number, field: keyof TimeEntry, value: any) => {
    const newData = [...monthlyData];
    newData[dayIndex].entries[entryIndex] = {
      ...newData[dayIndex].entries[entryIndex],
      [field]: value
    };
    
    // Update project name when project ID changes
    if (field === 'projectId') {
      const project = projects.find(p => p.id === value);
      newData[dayIndex].entries[entryIndex].projectName = project?.name || "";
    }
    
    setMonthlyData(newData);
  };

  const addEntry = (dayIndex: number) => {
    const newData = [...monthlyData];
    const newEntry: TimeEntry = {
      id: `${newData[dayIndex].date}-${newData[dayIndex].entries.length + 1}`,
      projectId: "",
      projectName: "",
      entryType: "project",
      hours: 0
    };
    newData[dayIndex].entries.push(newEntry);
    setMonthlyData(newData);
  };

  const removeEntry = (dayIndex: number, entryIndex: number) => {
    const newData = [...monthlyData];
    if (newData[dayIndex].entries.length > 1) {
      newData[dayIndex].entries.splice(entryIndex, 1);
      setMonthlyData(newData);
    }
  };

  const getDayTotal = (dayData: DayEntry) => {
    return dayData.entries.reduce((total, entry) => total + (entry.hours || 0), 0);
  };

  const getMonthTotal = () => {
    return monthlyData.reduce((total, day) => total + getDayTotal(day), 0);
  };

  const getWorkDaysTotal = () => {
    return monthlyData
      .filter(day => day.isWorkDay)
      .reduce((total, day) => total + getDayTotal(day), 0);
  };

  const handleSaveMonth = () => {
    // Validate work days have at least 8 hours
    const invalidWorkDays = monthlyData.filter(day => 
      day.isWorkDay && getDayTotal(day) > 0 && getDayTotal(day) < 8
    );

    if (invalidWorkDays.length > 0) {
      toast({
        title: "Validação de Horas",
        description: `${invalidWorkDays.length} dias úteis têm menos de 8 horas. Corrija antes de salvar.`,
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement API call to save all entries
    toast({
      title: "Timesheet Salvo",
      description: `${getMonthTotal()} horas registradas para ${selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      weekday: 'short'
    });
  };

  const monthName = selectedMonth.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-4">
            <span className="capitalize">Timesheet - {monthName}</span>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Total: {getMonthTotal()}h</span>
              <span>|</span>
              <span>Dias úteis: {getWorkDaysTotal()}h</span>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSaveMonth}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Mês
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900 w-24">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 w-32">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 flex-1">Projeto/Atividade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 w-24">Horas</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 w-20">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 w-16">Ações</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((dayData, dayIndex) => (
                <tr key={dayData.date} className={`border-b border-gray-100 ${!dayData.isWorkDay ? 'bg-gray-50' : ''}`}>
                  <td className="py-3 px-4 align-top">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(dayData.date)}
                    </div>
                    {!dayData.isWorkDay && (
                      <div className="text-xs text-gray-500">Final de semana</div>
                    )}
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="space-y-2">
                      {dayData.entries.map((entry, entryIndex) => (
                        <Select
                          key={entry.id}
                          value={entry.entryType}
                          onValueChange={(value) => updateEntry(dayIndex, entryIndex, 'entryType', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {entryTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="space-y-2">
                      {dayData.entries.map((entry, entryIndex) => (
                        <div key={entry.id}>
                          {entry.entryType === 'project' ? (
                            <Select
                              value={entry.projectId}
                              onValueChange={(value) => updateEntry(dayIndex, entryIndex, 'projectId', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Selecione o projeto" />
                              </SelectTrigger>
                              <SelectContent>
                                {projects.map(project => (
                                  <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              className="h-8"
                              value={entry.projectName}
                              onChange={(e) => updateEntry(dayIndex, entryIndex, 'projectName', e.target.value)}
                              placeholder={
                                entry.entryType === 'vacation' ? 'Período de férias' :
                                entry.entryType === 'leave' ? 'Tipo de licença' :
                                'Descrição'
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="space-y-2">
                      {dayData.entries.map((entry, entryIndex) => (
                        <Input
                          key={entry.id}
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          className="h-8 w-20"
                          value={entry.hours || ''}
                          onChange={(e) => updateEntry(dayIndex, entryIndex, 'hours', parseFloat(e.target.value) || 0)}
                          placeholder="0.0"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className={`text-sm font-medium ${
                      dayData.isWorkDay && getDayTotal(dayData) > 0 && getDayTotal(dayData) < 8 ? 'text-red-600' :
                      getDayTotal(dayData) >= 8 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {getDayTotal(dayData)}h
                      {dayData.isWorkDay && getDayTotal(dayData) > 0 && getDayTotal(dayData) < 8 && (
                        <div className="text-xs text-red-600">Mín: 8h</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addEntry(dayIndex)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      {dayData.entries.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEntry(dayIndex, dayData.entries.length - 1)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
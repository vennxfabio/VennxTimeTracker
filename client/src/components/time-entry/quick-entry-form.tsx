import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickEntryFormProps {
  selectedDate: string;
}

interface TimeEntry {
  id: string;
  type: string;
  project: string;
  hours: number;
}

export default function QuickEntryForm({ selectedDate }: QuickEntryFormProps) {
  const { toast } = useToast();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { id: '1', type: 'project', project: '', hours: 0 }
  ]);

  const projects = [
    'Projeto SOX - Ipiranga',
    'Auditoria - Ultrapar', 
    'LGPD - Afya',
    'Consultoria GRC - Bristow',
    'VAR - Equinox Gold'
  ];

  const entryTypes = [
    { value: 'project', label: 'Projeto' },
    { value: 'vacation', label: 'Férias' },
    { value: 'leave', label: 'Licença' },
    { value: 'hour_bank', label: 'Banco de Horas' }
  ];

  const addTimeEntry = () => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      type: 'project',
      project: '',
      hours: 0
    };
    setTimeEntries([...timeEntries, newEntry]);
  };

  const removeTimeEntry = (id: string) => {
    if (timeEntries.length > 1) {
      setTimeEntries(timeEntries.filter(entry => entry.id !== id));
    }
  };

  const updateTimeEntry = (id: string, field: keyof TimeEntry, value: any) => {
    setTimeEntries(timeEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + (entry.hours || 0), 0);
  };

  const isWorkDay = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday or Saturday
  };

  const handleSave = async () => {
    const total = getTotalHours();
    const isWork = isWorkDay(selectedDate);
    
    if (isWork && total < 8) {
      toast({
        title: "Aviso de Validação",
        description: "Em dias úteis é necessário lançar ao menos 8 horas.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement API call to save time entries
    toast({
      title: "Lançamento Salvo",
      description: `${total} horas registradas para ${new Date(selectedDate).toLocaleDateString('pt-BR')}`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lançamento Rápido - {formatDate(selectedDate)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Entries */}
        <div className="space-y-4">
          {timeEntries.map((entry, index) => (
            <div key={entry.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-700">Tipo</Label>
                <Select 
                  value={entry.type} 
                  onValueChange={(value) => updateTimeEntry(entry.id, 'type', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {entryTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Projeto/Atividade</Label>
                {entry.type === 'project' ? (
                  <Select 
                    value={entry.project} 
                    onValueChange={(value) => updateTimeEntry(entry.id, 'project', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    className="mt-1"
                    value={entry.project}
                    onChange={(e) => updateTimeEntry(entry.id, 'project', e.target.value)}
                    placeholder={
                      entry.type === 'vacation' ? 'Período de férias' :
                      entry.type === 'leave' ? 'Tipo de licença' :
                      'Descrição'
                    }
                  />
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Horas</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  className="mt-1"
                  value={entry.hours || ''}
                  onChange={(e) => updateTimeEntry(entry.id, 'hours', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeEntry(entry.id)}
                  disabled={timeEntries.length === 1}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Entry Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTimeEntry}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Linha</span>
        </Button>

        {/* Summary and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Total do dia: <span className="font-medium text-gray-900">{getTotalHours()} horas</span>
            {isWorkDay(selectedDate) && getTotalHours() < 8 && (
              <span className="text-red-600 ml-2">⚠ Mínimo 8h em dias úteis</span>
            )}
            {getTotalHours() >= 8 && (
              <span className="text-green-600 ml-2">✓ Meta atingida</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setTimeEntries([{ id: '1', type: 'project', project: '', hours: 0 }]);
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar Lançamento
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

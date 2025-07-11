import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarGrid from "@/components/time-entry/calendar-grid";
import QuickEntryForm from "@/components/time-entry/quick-entry-form";
import MonthlyTimesheet from "@/components/time-entry/monthly-timesheet";
import { isUnauthorizedError } from "@/lib/authUtils";
import { TrendingUp, Clock, AlertTriangle, Calendar, Table } from "lucide-react";

export default function TimeEntry() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("daily");

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
          <p className="text-gray-600">Carregando lançamento de horas...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lançamento de Horas</h2>
        <p className="text-gray-600">Registre suas horas trabalhadas por projeto e período</p>
      </div>

      {/* Personal KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Minha Alocação</p>
                <p className="text-3xl font-bold text-gray-900">92%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">Meta: 85%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Horas Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">16h</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-orange-600 font-medium">Últimos 7 dias</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo do Mês</p>
                <p className="text-3xl font-bold text-gray-900">+4h</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-blue-600 font-medium">Janeiro 2025</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entry Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="daily" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Lançamento Diário</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center space-x-2">
            <Table className="w-4 h-4" />
            <span>Timesheet Mensal</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          {/* Calendar Grid */}
          <CalendarGrid 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />

          {/* Quick Entry Form */}
          <QuickEntryForm 
            selectedDate={selectedDate} 
          />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyTimesheet 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

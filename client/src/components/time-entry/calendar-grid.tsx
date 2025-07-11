import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function CalendarGrid({ selectedDate, onDateSelect }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0]
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        dateString: date.toISOString().split('T')[0]
      });
    }

    // Add next month's days to complete the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const isWorkDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday or Saturday
  };

  const mockTimeEntries = {
    '2025-01-01': [
      { project: 'Projeto SOX - Ipiranga', hours: 6, type: 'project' },
      { project: 'LGPD - Afya', hours: 2, type: 'project' }
    ],
    '2025-01-02': [
      { project: 'Projeto SOX - Ipiranga', hours: 8, type: 'project' }
    ],
    '2025-01-03': [], // Pending
    '2025-01-06': [
      { project: 'Férias', hours: 8, type: 'vacation' }
    ]
  };

  const getDayTotal = (dateString: string) => {
    const entries = mockTimeEntries[dateString] || [];
    return entries.reduce((total, entry) => total + entry.hours, 0);
  };

  const getDayStatus = (date: Date, dateString: string) => {
    const total = getDayTotal(dateString);
    const isWork = isWorkDay(date);
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    
    if (!isWork) return 'weekend';
    if (!isPast) return 'future';
    if (total === 0) return 'pending';
    if (total >= 8) return 'complete';
    return 'incomplete';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'incomplete': return 'text-orange-600';
      case 'pending': return 'text-red-600';
      case 'weekend': return 'text-gray-400';
      case 'future': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{monthName}</CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setCurrentMonth(new Date());
                onDateSelect(new Date().toISOString().split('T')[0]);
              }}
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}

          {days.map(({ date, isCurrentMonth, dateString }, index) => {
            const total = getDayTotal(dateString);
            const status = getDayStatus(date, dateString);
            const entries = mockTimeEntries[dateString] || [];
            const isSelected = dateString === selectedDate;

            return (
              <div
                key={index}
                className={cn(
                  "border border-gray-200 rounded-lg p-2 min-h-[100px] cursor-pointer transition-colors",
                  isCurrentMonth ? "bg-white hover:bg-blue-50" : "bg-gray-50",
                  isSelected && "ring-2 ring-blue-500 bg-blue-50"
                )}
                onClick={() => isCurrentMonth && onDateSelect(dateString)}
              >
                <div className={cn(
                  "text-sm font-medium mb-2",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                )}>
                  {date.getDate()}
                </div>

                {isCurrentMonth && entries.length > 0 && (
                  <div className="space-y-1">
                    {entries.slice(0, 2).map((entry, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-xs px-2 py-1 rounded truncate",
                          entry.type === 'project' ? "bg-blue-100 text-blue-800" :
                          entry.type === 'vacation' ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        )}
                        title={`${entry.project} - ${entry.hours}h`}
                      >
                        {entry.project.split(' ')[0]} - {entry.hours}h
                      </div>
                    ))}
                    {entries.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{entries.length - 2} mais
                      </div>
                    )}
                  </div>
                )}

                {isCurrentMonth && status === 'pending' && (
                  <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Pendente
                  </div>
                )}

                {isCurrentMonth && total > 0 && (
                  <div className={cn(
                    "text-xs font-medium mt-1",
                    getStatusColor(status)
                  )}>
                    {total}h {total >= 8 ? '✓' : total > 0 ? '!' : '✗'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

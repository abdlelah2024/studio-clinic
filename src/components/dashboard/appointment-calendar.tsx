"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"
import { addDays, format, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { mockAppointments } from '@/lib/data';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const timeSlots = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

const getAppointmentsForDay = (day: Date, appointments: Appointment[]) => {
  return appointments.filter(app => app.date === format(day, 'yyyy-MM-dd'));
};

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-200 border-blue-400 text-blue-800';
    case 'Completed':
      return 'bg-green-200 border-green-400 text-green-800';
    case 'Canceled':
      return 'bg-red-200 border-red-400 text-red-800';
    default:
      return 'bg-gray-200 border-gray-400 text-gray-800';
  }
};

export function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Appointment Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(startOfCurrentWeek, 'MMM d')} - {format(endOfCurrentWeek, 'MMM d, yyyy')}
            </span>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-x-auto">
        <div className="grid grid-cols-8 min-w-[1200px]">
          {/* Time column */}
          <div className="col-span-1 border-r">
            <div className="h-12"></div> {/* Header space */}
            {timeSlots.map(time => (
              <div key={time} className="h-20 text-xs text-center text-muted-foreground pt-1 border-t">
                {time}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(day => (
            <div key={day.toString()} className="col-span-1 border-r last:border-r-0 relative">
              <div className="text-center p-2 h-12 border-b">
                <p className="text-sm font-semibold">{format(day, 'E')}</p>
                <p className="text-2xl font-bold">{format(day, 'd')}</p>
              </div>
              <div className="relative h-[calc(12*5rem)]"> {/* 12 time slots * 5rem height */}
                {getAppointmentsForDay(day, mockAppointments).map(app => {
                  const startHour = parseInt(app.startTime.split(':')[0]);
                  const startMinutes = parseInt(app.startTime.split(':')[1]);
                  const endHour = parseInt(app.endTime.split(':')[0]);
                  const endMinutes = parseInt(app.endTime.split(':')[1]);
                  
                  const top = ((startHour-8) * 60 + startMinutes) / (12 * 60) * 100;
                  const height = ((endHour-startHour) * 60 + (endMinutes-startMinutes)) / (12*60) * 100;
                  
                  return (
                    <div
                      key={app.id}
                      className={cn("absolute w-[calc(100%-4px)] left-[2px] p-2 rounded-lg border text-xs shadow-sm overflow-hidden", getStatusColor(app.status))}
                      style={{ top: `${top}%`, height: `${height}%` }}
                    >
                      <p className="font-bold truncate">{app.patient.name}</p>
                      <p className="truncate text-xs">{app.reason}</p>
                       <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={app.doctor.avatar} data-ai-hint="doctor person" />
                          <AvatarFallback>{app.doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs truncate">{app.doctor.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

'use client';
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday } from 'date-fns';
import TaskCard from './TaskCard';
import { useTasks } from '../../hooks/useTasks';
import { useTeam } from '../../hooks/useTeam';

// Inline SVG components
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function CalendarView() {
  const { tasks, loading, error, updateStatus } = useTasks();
  const { team } = useTeam();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a map of team members for quick lookup
  const teamMap = team?.reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {});

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-2 sm:mb-4">
      <button 
        onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
        className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
        aria-label="Previous month"
      >
        <ChevronLeftIcon />
      </button>
      <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button 
        onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
        className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
        aria-label="Next month"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );

  const renderDays = () => {
    const dateFormat = windowWidth < 640 ? 'EEEEE' : 'EEE'; // Single character on mobile
    const days = [];
    const startDate = startOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center p-1 sm:p-2 text-xs sm:text-sm text-gray-500" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-1 sm:mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    const today = new Date();

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayTasks = tasks?.filter(task => 
          task.dueDate && isSameDay(new Date(task.dueDate), day)
        ) || [];

        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(day)}
            className={`min-h-16 sm:min-h-24 p-1 sm:p-2 border cursor-pointer ${
              !isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : 'bg-white'
            } ${
              isSameDay(day, selectedDate) ? 'border-indigo-500' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between">
              <span className={`text-xs sm:text-sm ${
                isToday(day) ? 'bg-indigo-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center' : ''
              }`}>
                {format(day, 'd')}
              </span>
              {isSameDay(day, today) && (
                <span className="text-xs bg-indigo-100 text-indigo-800 px-1 rounded hidden sm:inline">Today</span>
              )}
            </div>
            <div className="mt-1 space-y-1 overflow-y-auto max-h-12 sm:max-h-20">
              {dayTasks.map(task => {
                const assignedMember = teamMap?.[task.assignedTo];
                return (
                  <TaskCard 
                    key={task.id} 
                    task={{
                      ...task,
                      assignedTo: assignedMember
                    }}
                    compact={true}
                    onToggleStatus={(newStatus) => updateStatus(task.id, newStatus)}
                  />
                );
              })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  if (loading) return <div className="p-4">Loading calendar...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
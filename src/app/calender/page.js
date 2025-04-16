'use client';
import { useState, useEffect } from 'react';
import CalendarView from '../../components/tasks/CalendarView';
import { useTasks } from '../../hooks/useTasks';

const Calendar = () => {
  const { tasks, loading, error } = useTasks();
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState('month'); // 'month', 'week', or 'day'
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
    // Add your task click logic here (e.g., open modal)
  };

  const handleDateSelect = (date) => {
    console.log('Date selected:', date);
    // Add your date selection logic here
  };

  const navigateToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const getFormattedDateRange = () => {
    const options = { month: 'long', year: 'numeric' };
    if (view === 'month') {
      return currentDate.toLocaleDateString(undefined, options);
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`;
      } else {
        return `${startOfWeek.getDate()} ${startOfWeek.toLocaleDateString(undefined, { month: 'short' })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;
      }
    } else {
      return currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading tasks. Please try again later.
      </div>
    );
  }

  return (
    <div className={`p-4 transition-opacity mt-6 duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Calendar</h1>
          <div className="flex space-x-2">
            <button 
              onClick={navigateToToday}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hidden sm:block"
            >
              Today
            </button>
            <div className="flex">
              <button 
                onClick={navigateToPrevious}
                className="p-1 rounded-l-md bg-white border border-r-0 border-gray-300 hover:bg-gray-50"
              >
                <span aria-hidden="true" className="text-gray-600 font-bold">&lt;</span>
                <span className="sr-only">Previous</span>
              </button>
              <button 
                onClick={navigateToNext}
                className="p-1 rounded-r-md bg-white border border-gray-300 hover:bg-gray-50"
              >
                <span aria-hidden="true" className="text-gray-600 font-bold">&gt;</span>
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <span className="mr-2 text-gray-500">📅</span>
            <h2 className="text-lg font-medium">{getFormattedDateRange()}</h2>
          </div>
          <div className="flex p-1 bg-gray-100 rounded-md">
            <button 
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'month' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'week' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm rounded-md ${view === 'day' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
            >
              Day
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CalendarView 
          tasks={tasks} 
          onTaskClick={handleTaskClick}
          onDateSelect={handleDateSelect}
          view={view}
          currentDate={currentDate}
        />
      </div>
      
      {/* Mobile bottom action buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 shadow-md">
        <button 
          onClick={navigateToToday}
          className="flex flex-col items-center px-4 py-1 text-indigo-600"
        >
          <span className="text-lg">📅</span>
          <span className="text-xs mt-1">Today</span>
        </button>
        <button 
          onClick={() => setView('month')}
          className={`flex flex-col items-center px-4 py-1 ${view === 'month' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <span className="text-lg">🗓️</span>
          <span className="text-xs mt-1">Month</span>
        </button>
        <button 
          onClick={() => setView('week')}
          className={`flex flex-col items-center px-4 py-1 ${view === 'week' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <span className="text-lg">📊</span>
          <span className="text-xs mt-1">Week</span>
        </button>
        <button 
          onClick={() => setView('day')}
          className={`flex flex-col items-center px-4 py-1 ${view === 'day' ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <span className="text-lg">📆</span>
          <span className="text-xs mt-1">Day</span>
        </button>
      </div>
      
      {/* Add padding at the bottom for mobile to ensure content isn't hidden behind the bottom bar */}
      <div className="md:hidden h-16"></div>
    </div>
  );
}

export default Calendar;
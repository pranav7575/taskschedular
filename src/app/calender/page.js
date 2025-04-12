'use client';
import { useState } from 'react';
import CalendarView from '../../components/tasks/CalendarView';
import { useTasks } from '../../hooks/useTasks'; // Assuming you have this hook

const Calendar = () => {
  // Fetch tasks (replace with your actual data fetching logic)
  const { tasks, loading, error } = useTasks(); 
  // Or use mock data for testing:
  // const [tasks] = useState([
  //   {
  //     id: '1',
  //     title: 'Complete project',
  //     dueDate: new Date().toISOString(),
  //     status: 'pending',
  //     priority: 'high'
  //   }
  // ]);

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
    // Add your task click logic here (e.g., open modal)
  };

  const handleDateSelect = (date) => {
    console.log('Date selected:', date);
    // Add your date selection logic here
  };

  if (loading) return <div>Loading calendar...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <CalendarView 
        tasks={tasks} 
        onTaskClick={handleTaskClick}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}

export default Calendar;
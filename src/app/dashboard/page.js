'use client';
import { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import StatsCard from '../../components/dashboard/StatsCard';
import TaskChart from '../../components/dashboard/TaskChart';
import RecentTasks from '../../components/dashboard/RecentTasks';

export default function Dashboard() {
  const { tasks, loading } = useTasks();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`space-y-6 p-4 md:p-6 mt-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Tasks" 
          value={totalTasks} 
          icon="📋" 
          bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
          textColor="text-blue-700"
        />
        <StatsCard 
          title="Completed" 
          value={completedTasks} 
          icon="✅" 
          bgColor="bg-gradient-to-r from-green-50 to-green-100"
          textColor="text-green-700"
        />
        <StatsCard 
          title="Pending" 
          value={pendingTasks} 
          icon="⏳" 
          bgColor="bg-gradient-to-r from-amber-50 to-amber-100"
          textColor="text-amber-700"
        />
        <StatsCard 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          icon="📈" 
          bgColor="bg-gradient-to-r from-purple-50 to-purple-100"
          textColor="text-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Progress</h2>
          <TaskChart tasks={tasks} />
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Tasks</h2>
            <Link href="/tasks" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View all
            </Link>
          </div>
          <RecentTasks tasks={tasks.slice(0, 5)} />
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Distribution</h2>
        <div className="h-64">
          {/* Placeholder for another chart or component */}
          <div className="bg-gray-50 h-full rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Task distribution chart</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing import
import Link from 'next/link';
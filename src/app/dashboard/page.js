'use client';
import { useTasks } from '../../hooks/useTasks';
import StatsCard from '../../components/dashboard/StatsCard';
import TaskChart from '../../components/dashboard/TaskChart';
import RecentTasks from '../../components/dashboard/RecentTasks';

export default function Dashboard() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return <div>Loading...</div>;
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Tasks" value={totalTasks} icon="📋" />
        <StatsCard title="Completed" value={completedTasks} icon="✅" />
        <StatsCard title="Pending" value={pendingTasks} icon="⏳" />
        <StatsCard title="Completion Rate" value={`${completionRate}%`} icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <TaskChart tasks={tasks} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <RecentTasks tasks={tasks.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
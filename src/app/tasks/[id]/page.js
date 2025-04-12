'use client';
import { useTasks } from '../../../hooks/useTasks';
import { useRouter } from 'next/navigation';
import TaskForm from '../../../components/tasks/TaskForm';
import Button from '../../../components/ui/Button';
import Link from 'next/link';

export default function TaskDetail({ params }) {
  const { id } = params;
  const { tasks, updateTask } = useTasks();
  const router = useRouter();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Task not found</h1>
        <Link href="/tasks" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Back to tasks
        </Link>
      </div>
    );
  }

  const handleSubmit = async (taskData) => {
    await updateTask(id, taskData);
    router.push('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Details</h1>
        <Link href="/tasks">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TaskForm
          onSubmit={handleSubmit}
          initialValues={task}
          onCancel={() => router.push('/tasks')}
          isEditMode
        />
      </div>
    </div>
  );
}
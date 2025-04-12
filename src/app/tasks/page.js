'use client';
import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskFilter from '../../components/tasks/TaskFilter';
import TaskCard from '../../components/tasks/TaskCard';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';

export default function Tasks() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = tasks.filter(task => {
    // Apply search filter
    if (searchQuery && 
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Apply other filters
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.projectId && task.projectId !== filters.projectId) return false;
    return true;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      await addTask(taskData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <Button onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}>
          Add Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchBar onSearch={handleSearch} />
        <TaskFilter filters={filters} setFilters={setFilters} />
      </div>

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
              onDelete={() => deleteTask(task.id)}
              onToggleStatus={() => updateTask(task.id, {
                status: task.status === 'completed' ? 'pending' : 'completed'
              })}
            />
          ))}
        </div>
      )}

      {!loading && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found matching your criteria</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onSubmit={handleSubmit}
          initialValues={editingTask || {}}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
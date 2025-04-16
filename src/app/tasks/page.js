'use client';
import { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskFilter from '../../components/tasks/TaskFilter';
import TaskCard from '../../components/tasks/TaskCard';
import TaskForm from '../../components/tasks/TaskForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import { PlusIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Tasks() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  return (
    <div className={`p-4 space-y-6 transition-opacity  mt-6 duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tasks</h1>
        <Button 
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="flex items-center text-sm md:text-base"
        >
          <PlusIcon className="h-4 w-4 md:h-5 md:w-5 mr-1" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Desktop search and filter bar */}
      <div className="hidden md:flex md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
        <TaskFilter filters={filters} setFilters={setFilters} />
      </div>

      {/* Mobile search and filter toggle */}
      <div className="flex md:hidden flex-col gap-3 mb-4">
        <SearchBar onSearch={handleSearch} />
        <button 
          onClick={toggleFilterDrawer}
          className="flex items-center justify-center w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          <span>Filter Tasks</span>
          {Object.keys(filters).length > 0 && (
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${isFilterDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleFilterDrawer}></div>
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-xl shadow-xl transform transition-transform duration-300 ease-in-out ${isFilterDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Filter Tasks</h3>
          <button onClick={toggleFilterDrawer} className="p-1">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <TaskFilter filters={filters} setFilters={setFilters} isMobile />
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => {
                toggleFilterDrawer();
              }}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No tasks found</p>
          <p className="text-gray-500 mt-1 max-w-md">
            {searchQuery 
              ? "Try adjusting your search or filters to find what you're looking for" 
              : "Create your first task by clicking the 'Add Task' button"}
          </p>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({});
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
          )}
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
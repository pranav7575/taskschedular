'use client';
import React, { useState } from 'react';
import { useTasks } from '../../../hooks/useTasks';
import { useProjects } from '../../../hooks/useProjects';
import TaskCard from '../../../components/tasks/TaskCard';
import TaskForm from '../../../components/tasks/TaskForm';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Link from 'next/link';
import { use } from 'react';

export default function ProjectDetails({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { tasks, loading: tasksLoading, addTask } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (projectsLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(task => task.projectId === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Project not found</h1>
        <Link href="/projects" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  const handleAddTask = async (taskData) => {
    await addTask({
      ...taskData,
      projectId: id
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 mt-1">{project.description}</p>
          )}
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => {
              // Implement edit functionality
            }}
            onDelete={() => {
              // Implement delete functionality
            }}
            onToggleStatus={(newStatus) => {
              // Implement toggle status
            }}
          />
        ))}
      </div>

      {projectTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks in this project yet.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onSubmit={handleAddTask}
          initialValues={{ projectId: id }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
'use client';
import { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function Projects() {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleSubmit = async (projectData) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
      setEditingProject(null);
    } else {
      await addProject(projectData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <Button onClick={() => {
          setEditingProject(null);
          setIsModalOpen(true);
        }}>
          Add Project
        </Button>
      </div>

      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {
                setEditingProject(project);
                setIsModalOpen(true);
              }}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm
          onSubmit={handleSubmit}
          initialValues={editingProject || {}}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
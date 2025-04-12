'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProjects, addProject, updateProject, deleteProject } from '../../firebase/services';

export function useProjects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchProjects = async () => {
      setLoading(true);
      const projects = await getProjects(currentUser.uid);
      setProjects(projects);
      setLoading(false);
    };

    fetchProjects();
  }, [currentUser]);

  const handleAddProject = async (projectData) => {
    const newProject = await addProject({
      ...projectData,
      userId: currentUser.uid
    });
    setProjects([...projects, { id: newProject.id, ...projectData }]);
  };

  const handleUpdateProject = async (projectId, projectData) => {
    await updateProject(projectId, projectData);
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, ...projectData } : project
    ));
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects(projects.filter(project => project.id !== projectId));
  };

  return {
    projects,
    loading,
    addProject: handleAddProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject
  };
}
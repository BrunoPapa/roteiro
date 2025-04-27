// src/context/ProjectContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [nextId, setNextId] = useState(() => {
    const savedNextId = localStorage.getItem('nextId');
    return savedNextId ? parseInt(savedNextId) : 1;
  });

  // Save to localStorage whenever projects or nextId changes
  React.useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  React.useEffect(() => {
    localStorage.setItem('nextId', nextId.toString());
  }, [nextId]);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: `p${nextId}`,
      characters: [],
      timelines: [],
      scripts: []
    };
    setProjects([...projects, newProject]);
    setNextId(nextId + 1);
    return newProject;
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getProjectById = (id) => {
    return projects.find(p => p.id === id);
  };

  const updateProject = (updatedProject) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  const deleteCharacter = (projectId, characterId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          characters: project.characters.filter(c => c.id !== characterId)
        };
      }
      return project;
    }));
  };

  const deleteTimeline = (projectId, timelineId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          timelines: project.timelines.filter(t => t.id !== timelineId)
        };
      }
      return project;
    }));
  };

  const deleteScript = (projectId, scriptId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          scripts: project.scripts.filter(s => s.id !== scriptId)
        };
      }
      return project;
    }));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      deleteProject,
      getProjectById,
      updateProject,
      deleteCharacter,
      deleteTimeline,
      deleteScript
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectContext);
}
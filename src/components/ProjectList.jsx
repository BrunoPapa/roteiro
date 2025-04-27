// src/components/ProjectList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';

function ProjectList() {
  const navigate = useNavigate();
  const { isDarkMode, fontSize } = useTheme();
  const { projects, addProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const project = addProject(newProject);
    setIsModalOpen(false);
    setNewProject({ name: '', description: '' });
    navigate(`/project/${project.id}`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
         style={{ fontSize: `${fontSize}px` }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            New Project
          </button>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className={`flex items-center justify-between p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <span className="cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                  {project.name}
                </span>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg max-w-md w-full`}>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full p-2 border rounded text-gray-900"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Description *</label>
                  <textarea
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full p-2 border rounded text-gray-900"
                    rows="3"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
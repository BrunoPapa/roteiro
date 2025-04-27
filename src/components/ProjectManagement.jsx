import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import Dashboard from './Dashboard';
import { useProjects } from '../context/ProjectContext';
import { useTheme } from '../context/ThemeContext';
import CharacterForm from './CharacterForm';
import TimelineForm from './TimelineForm';
import ScriptForm from './ScriptForm';
import ListLayout from './ListLayout';
import DeleteConfirmation from './DeleteConfirmation';
import TimelineEvents from './TimelineEvents';
import ScriptWriting from './ScriptWriting';

const menuItems = [
  { name: 'Dashboard', icon: ChartBarIcon },
  { name: 'Characters', icon: UserGroupIcon },
  { name: 'Timelines', icon: ClockIcon },
  { name: 'Scripts', icon: DocumentIcon },
];

function ProjectManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, getProjectById, updateProject, deleteCharacter, deleteTimeline, deleteScript } = useProjects();
  const { isDarkMode, toggleDarkMode, fontSize, setFontSize } = useTheme();
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null, type: null });
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [selectedScript, setSelectedScript] = useState(null);
  
  const project = getProjectById(id);

  if (!project) return <div>Project not found</div>;

  React.useEffect(() => {
    if (project) {
      setIsLoading(false);
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} flex items-center justify-center`}>
        Loading...
      </div>
    );
  }

  const handleEdit = (item, section) => {
    setEditItem(item);
    setActiveSection(section || activeSection);
  };

  const handleDelete = (item, type) => {
    setDeleteModal({ show: true, item, type });
  };

  const confirmDelete = () => {
    const { item, type } = deleteModal;
    switch (type) {
      case 'character':
        deleteCharacter(project.id, item.id);
        break;
      case 'timeline':
        deleteTimeline(project.id, item.id);
        break;
      case 'script':
        deleteScript(project.id, item.id);
        break;
    }
    setDeleteModal({ show: false, item: null, type: null });
  };

  const handleSave = (item) => {
    let updatedProject = { ...project };
    const newItem = { ...item, id: editItem?.id || `${activeSection}-${Date.now()}` };

    switch (activeSection) {
      case 'characters':
        updatedProject.characters = editItem
          ? project.characters.map(c => c.id === editItem.id ? newItem : c)
          : [...(project.characters || []), newItem];
        break;
      case 'timelines':
        updatedProject.timelines = editItem
          ? project.timelines.map(t => t.id === editItem.id ? newItem : t)
          : [...(project.timelines || []), newItem];
        break;
      case 'scripts':
        updatedProject.scripts = editItem
          ? project.scripts.map(s => s.id === editItem.id ? newItem : s)
          : [...(project.scripts || []), newItem];
        break;
    }

    updateProject(updatedProject);
    setActiveSection(activeSection);
    setEditItem(null);
  };

  const handleViewEvents = (timeline) => {
    setSelectedTimeline(timeline);
  };

  const handleViewScript = (script) => {
    setSelectedScript(script);
  };

  const handleUpdateTimeline = (updatedTimeline) => {
    const updatedProject = {
      ...project,
      timelines: project.timelines.map(t =>
        t.id === updatedTimeline.id ? updatedTimeline : t
      )
    };
    updateProject(updatedProject);
  };

  const handleUpdateScript = (updatedScript) => {
    const updatedProject = {
      ...project,
      scripts: project.scripts.map(s =>
        s.id === updatedScript.id ? updatedScript : s
      )
    };
    updateProject(updatedProject);
  };

  const renderContent = () => {
    if (selectedTimeline) {
      return (
        <TimelineEvents
          timeline={selectedTimeline}
          onClose={() => setSelectedTimeline(null)}
          onUpdate={handleUpdateTimeline}
        />
      );
    }

    if (selectedScript) {
      return (
        <ScriptWriting
          script={selectedScript}
          onBack={() => setSelectedScript(null)}
          onUpdate={handleUpdateScript}
        />
      );
    }

    if (activeSection === 'dashboard') {
      return <Dashboard project={project} />;
    }

    if (editItem !== null) {
      switch (activeSection) {
        case 'characters':
          return (
            <CharacterForm
              character={editItem}
              existingCharacters={project.characters || []}
              onSave={handleSave}
              onCancel={() => setEditItem(null)}
            />
          );
        case 'timelines':
          return (
            <TimelineForm
              timeline={editItem}
              onSave={handleSave}
              onCancel={() => setEditItem(null)}
            />
          );
        case 'scripts':
          return (
            <ScriptForm
              script={editItem}
              onSave={handleSave}
              onCancel={() => setEditItem(null)}
            />
          );
      }
    }

    const items = project[activeSection] || [];
    const columns = {
      characters: [
        { field: 'name', header: 'Nome' },
        { field: 'gender', header: 'Gênero' }
      ],
      timelines: [
        { field: 'name', header: 'Nome' },
        { field: 'timeUnit', header: 'Unidade' },
        { field: 'startEvent', header: 'Início' },
        { field: 'endEvent', header: 'Fim' }
      ],
      scripts: [
        { field: 'name', header: 'Nome' },
        { field: 'description', header: 'Descrição' }
      ]
    };

    return (
      <ListLayout
        items={items}
        columns={columns[activeSection]}
        onEdit={(item) => setEditItem(item)}
        onDelete={(item) => handleDelete(item, activeSection.slice(0, -1))}
        title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        onViewEvents={
          activeSection === 'timelines' ? handleViewEvents :
          activeSection === 'scripts' ? handleViewScript :
          undefined
        }
      />
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
         style={{ fontSize: `${fontSize}px` }}>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-all ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
        <button
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-2 bg-blue-600 rounded-full p-1"
        >
          {isSidebarExpanded ? (
            <ChevronLeftIcon className="h-4 w-4 text-white" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-white" />
          )}
        </button>

        <div className="p-4">
          {menuItems.map(({ name, icon: Icon }) => (
            <div
              key={name}
              onClick={() => {
                setActiveSection(name.toLowerCase());
                setEditItem(null);
              }}
              className={`mb-4 cursor-pointer p-2 rounded transition-colors 
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
                ${activeSection === name.toLowerCase() ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''}
                flex items-center gap-2
              `}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {isSidebarExpanded && <span>{name}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarExpanded ? 'ml-64' : 'ml-16'} transition-all`}>
        {renderContent()}
      </div>

      <DeleteConfirmation
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, item: null, type: null })}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.name}
      />
    </div>
  );
}

export default ProjectManagement;
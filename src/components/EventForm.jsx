// src/components/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectContext';
import { useParams } from 'react-router-dom';

const relationshipTypes = ['Sequencial', 'Direto', 'Indireto', 'Oculto'];
const characterActions = ['No Evento', 'Citado'];

function EventForm({ event, time, onSave, onCancel, existingEvents }) {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const { getProjectById } = useProjects();
  const project = getProjectById(id);

  const [formData, setFormData] = useState({
    name: '',
    script: '',
    characters: [],
    relatedEvents: [],
    time: time
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCharacterToggle = (characterId) => {
    setFormData(prev => {
      const existingChar = prev.characters.find(c => c.id === characterId);
      if (existingChar) {
        return {
          ...prev,
          characters: prev.characters.filter(c => c.id !== characterId)
        };
      }
      return {
        ...prev,
        characters: [...prev.characters, { id: characterId, action: 'No Evento' }]
      };
    });
  };

  const handleCharacterActionChange = (characterId, action) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.map(c =>
        c.id === characterId ? { ...c, action } : c
      )
    }));
  };

  const handleEventRelationToggle = (relatedEventId) => {
    setFormData(prev => {
      const existingRelation = prev.relatedEvents.find(r => r.id === relatedEventId);
      if (existingRelation) {
        return {
          ...prev,
          relatedEvents: prev.relatedEvents.filter(r => r.id !== relatedEventId)
        };
      }
      return {
        ...prev,
        relatedEvents: [...prev.relatedEvents, { id: relatedEventId, type: 'Sequencial' }]
      };
    });
  };

  const handleEventRelationTypeChange = (relatedEventId, type) => {
    setFormData(prev => ({
      ...prev,
      relatedEvents: prev.relatedEvents.map(r =>
        r.id === relatedEventId ? { ...r, type } : r
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.script) {
      alert('Nome e Roteiro são obrigatórios');
      return;
    }
    onSave(formData);
  };

  const inputClassName = `w-full p-2 rounded border ${
    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2">Nome *</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block mb-2">Roteiro *</label>
        <textarea
          name="script"
          required
          value={formData.script}
          onChange={handleChange}
          rows="4"
          className={inputClassName}
        />
      </div>

      <div>
        <h3 className="font-bold mb-2">Personagens</h3>
        <div className="grid grid-cols-2 gap-4">
          {project.characters?.map(character => (
            <div key={character.id} className={`p-4 rounded ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.characters.some(c => c.id === character.id)}
                  onChange={() => handleCharacterToggle(character.id)}
                  className="rounded"
                />
                <span>{character.name}</span>
              </div>
              {formData.characters.some(c => c.id === character.id) && (
                <select
                  value={formData.characters.find(c => c.id === character.id)?.action}
                  onChange={(e) => handleCharacterActionChange(character.id, e.target.value)}
                  className={`mt-2 w-full ${inputClassName}`}
                >
                  {characterActions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">Eventos Relacionados</h3>
        <div className="grid grid-cols-2 gap-4">
          {existingEvents
            .filter(e => e.id !== event?.id)
            .map(relatedEvent => (
              <div key={relatedEvent.id} className={`p-4 rounded ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.relatedEvents.some(r => r.id === relatedEvent.id)}
                    onChange={() => handleEventRelationToggle(relatedEvent.id)}
                    className="rounded"
                  />
                  <span>{relatedEvent.name}</span>
                </div>
                {formData.relatedEvents.some(r => r.id === relatedEvent.id) && (
                  <select
                    value={formData.relatedEvents.find(r => r.id === relatedEvent.id)?.type}
                    onChange={(e) => handleEventRelationTypeChange(relatedEvent.id, e.target.value)}
                    className={`mt-2 w-full ${inputClassName}`}
                  >
                    {relationshipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

export default EventForm;
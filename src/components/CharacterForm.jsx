// src/components/CharacterForm.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const relationshipTypes = [
  'pai/mãe',
  'irmãos',
  'parentes',
  'amigos',
  'inimigos',
  'conhecido',
  'funcionário',
  'patrão',
  'outros'
];

const genderOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outros', label: 'Outros' }
];

function CharacterForm({ character, onSave, onCancel, existingCharacters = [] }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    biography: '',
    relationships: []
  });
  const [newRelationship, setNewRelationship] = useState({
    characterId: '',
    type: ''
  });

  useEffect(() => {
    if (character) {
      setFormData(character);
    }
  }, [character]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddRelationship = () => {
    if (newRelationship.characterId && newRelationship.type) {
      const relatedCharacter = existingCharacters.find(
        c => c.id === newRelationship.characterId
      );
      
      setFormData(prev => ({
        ...prev,
        relationships: [
          ...prev.relationships,
          {
            ...newRelationship,
            characterName: relatedCharacter.name
          }
        ]
      }));
      
      setNewRelationship({ characterId: '', type: '' });
    }
  };

  const removeRelationship = (index) => {
    setFormData(prev => ({
      ...prev,
      relationships: prev.relationships.filter((_, i) => i !== index)
    }));
  };

  const inputClassName = `w-full p-2 rounded border ${
    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
  }`;

  const availableCharacters = existingCharacters.filter(
    c => c.id !== character?.id && 
    !formData.relationships.some(r => r.characterId === c.id)
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Nome *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClassName}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Data de Nascimento</label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className={inputClassName}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Gênero *</label>
          <select
            required
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className={inputClassName}
          >
            <option value="">Selecione o gênero</option>
            {genderOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Biografia</label>
          <textarea
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            rows="4"
            className={inputClassName}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Relacionamentos</label>
          {availableCharacters.length > 0 && (
            <div className="flex gap-2 mb-2">
              <select
                value={newRelationship.characterId}
                onChange={(e) => setNewRelationship({
                  ...newRelationship,
                  characterId: e.target.value
                })}
                className={`flex-1 ${inputClassName}`}
              >
                <option value="">Selecione um personagem</option>
                {availableCharacters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
              
              <select
                value={newRelationship.type}
                onChange={(e) => setNewRelationship({
                  ...newRelationship,
                  type: e.target.value
                })}
                className={`flex-1 ${inputClassName}`}
              >
                <option value="">Tipo de relacionamento</option>
                {relationshipTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={handleAddRelationship}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          )}

          <div className="space-y-2">
            {formData.relationships.map((rel, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <span>
                  {rel.characterName} - {rel.type}
                </span>
                <button
                  type="button"
                  onClick={() => removeRelationship(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
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
    </div>
  );
}

export default CharacterForm;
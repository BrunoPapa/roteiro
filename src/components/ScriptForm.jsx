// src/components/ScriptForm.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function ScriptForm({ script, onSave, onCancel }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (script) {
      setFormData(script);
    }
  }, [script]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClassName = `w-full p-2 rounded border ${
    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
  }`;

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
          <label className="block mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            className={inputClassName}
          />
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

export default ScriptForm;
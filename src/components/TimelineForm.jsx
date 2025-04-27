// src/components/TimelineForm.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const timeUnits = ['minute', 'hour', 'day', 'week', 'month', 'year'];

function TimelineForm({ timeline, onSave, onCancel }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timeUnit: '',
    startEvent: '',
    endEvent: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (timeline) {
      setFormData(timeline);
    }
  }, [timeline]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = parseInt(formData.startEvent);
    const end = parseInt(formData.endEvent);

    if (end <= start) {
      setError('O fim do evento deve ser maior que o início');
      return;
    }

    onSave({
      ...formData,
      startEvent: start,
      endEvent: end
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
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
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={inputClassName}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tempo do Evento *</label>
          <select
            name="timeUnit"
            required
            value={formData.timeUnit}
            onChange={handleChange}
            className={inputClassName}
          >
            <option value="">Selecione uma unidade</option>
            {timeUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Início do Evento *</label>
          <input
            type="number"
            name="startEvent"
            required
            value={formData.startEvent}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Fim do Evento *</label>
          <input
            type="number"
            name="endEvent"
            required
            value={formData.endEvent}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}

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

export default TimelineForm;
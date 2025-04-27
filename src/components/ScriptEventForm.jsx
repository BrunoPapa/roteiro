// src/components/ScriptEventForm.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

function ScriptEventForm({ event, onSave, onCancel }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    associatedEvents: []
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddAssociatedEvent = () => {
    setFormData({
      ...formData,
      associatedEvents: [
        ...formData.associatedEvents,
        { id: Date.now(), type: 'direct', eventId: '' }
      ]
    });
  };

  const handleRemoveAssociatedEvent = (index) => {
    const newEvents = [...formData.associatedEvents];
    newEvents.splice(index, 1);
    setFormData({ ...formData, associatedEvents: newEvents });
  };

  const handleAssociatedEventChange = (index, field, value) => {
    const newEvents = [...formData.associatedEvents];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData({ ...formData, associatedEvents: newEvents });
  };

  const inputClassName = `w-full p-2 rounded border ${
    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
  }`;

  const selectClassName = `w-full p-2 rounded border ${
    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">{t('event.title')} *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block mb-2">{t('event.description')}</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className={inputClassName}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label>Associated Events</label>
          <button
            type="button"
            onClick={handleAddAssociatedEvent}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Event
          </button>
        </div>
        {formData.associatedEvents.map((assocEvent, index) => (
          <div key={assocEvent.id} className="flex gap-2 mb-2">
            <select
              value={assocEvent.type}
              onChange={(e) => handleAssociatedEventChange(index, 'type', e.target.value)}
              className={selectClassName}
            >
              <option value="direct">Direct</option>
              <option value="indirect">Indirect</option>
              <option value="hidden">Hidden</option>
            </select>
            <input
              type="text"
              value={assocEvent.eventId}
              onChange={(e) => handleAssociatedEventChange(index, 'eventId', e.target.value)}
              placeholder="Event ID"
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => handleRemoveAssociatedEvent(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}

export default ScriptEventForm;
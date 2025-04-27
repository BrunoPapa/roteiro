// src/components/ScriptWriting.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import ScriptEventForm from './ScriptEventForm';
import DeleteConfirmation from './DeleteConfirmation';

function ScriptWriting({ script, onBack, project }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem(`script-events-${script.id}`);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, [script.id]);

  useEffect(() => {
    localStorage.setItem(`script-events-${script.id}`, JSON.stringify(events));
  }, [events, script.id]);

  const handleAddEvent = (index) => {
    setSelectedLineIndex(index);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editEvent) {
      setEvents(events.map(e => e.id === editEvent.id ? { ...eventData, id: editEvent.id } : e));
    } else {
      const newEvent = {
        ...eventData,
        id: `script-event-${Date.now()}`,
        lineIndex: selectedLineIndex
      };
      
      // Insert the new event at the selected line index
      const newEvents = [...events];
      newEvents.splice(selectedLineIndex, 0, newEvent);
      
      // Update line indices for all events after the insertion point
      const updatedEvents = newEvents.map((event, index) => ({
        ...event,
        lineIndex: index
      }));
      
      setEvents(updatedEvents);
    }
    setShowEventForm(false);
    setEditEvent(null);
    setSelectedLineIndex(null);
  };

  const handleEventDrop = (draggedEventId, targetLineIndex) => {
    const draggedEvent = events.find(e => e.id === draggedEventId);
    if (!draggedEvent) return;

    const newEvents = events.filter(e => e.id !== draggedEventId);
    newEvents.splice(targetLineIndex, 0, { ...draggedEvent, lineIndex: targetLineIndex });

    // Update line indices for all events
    const updatedEvents = newEvents.map((event, index) => ({
      ...event,
      lineIndex: index
    }));

    setEvents(updatedEvents);
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const newEvents = events.filter(event => event.id !== eventToDelete.id)
      .map((event, index) => ({
        ...event,
        lineIndex: index
      }));
    setEvents(newEvents);
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  // Always show one more empty line than the number of events
  const totalLines = events.length + 1;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center mb-4 space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={t('common.back')}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold">
          {script.name} - {t('common.writeScript')}
        </h2>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="min-h-[300px]">
          {Array.from({ length: totalLines }, (_, index) => {
            const event = events.find(e => e.lineIndex === index);
            return (
              <div
                key={index}
                className={`min-h-[100px] border-b border-gray-200 p-4 relative ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const eventId = e.dataTransfer.getData('eventId');
                  handleEventDrop(eventId, index);
                }}
              >
                {event ? (
                  <div
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('eventId', event.id)}
                    className={`w-full p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    } cursor-move`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{event.title}</h3>
                        <p className="text-sm mt-2">{event.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="text-red-600 hover:text-red-800"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddEvent(index)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <ScriptEventForm
              event={editEvent}
              project={project}
              onSave={handleSaveEvent}
              onCancel={() => {
                setShowEventForm(false);
                setEditEvent(null);
                setSelectedLineIndex(null);
              }}
            />
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmation
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setEventToDelete(null);
          }}
          onConfirm={confirmDelete}
          title={t('common.confirmDelete.title')}
          message={t('common.confirmDelete.message', { name: eventToDelete?.title })}
        />
      )}
    </div>
  );
}

export default ScriptWriting;
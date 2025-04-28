// src/components/TimelineEvents.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import DraggableEvent from './DraggableEvent';
import EventForm from './EventForm';
import DeleteConfirmation from './DeleteConfirmation';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

function TimelineEvents({ timeline, onBack }) {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [events, setEvents] = useState(timeline.events || []);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem(`timeline-events-${timeline.id}`);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, [timeline.id]);

  useEffect(() => {
    localStorage.setItem(`timeline-events-${timeline.id}`, JSON.stringify(events));
  }, [events, timeline.id]);

  const handleAddEvent = (time) => {
    setSelectedTime(time);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editEvent) {
      setEvents(events.map(e => e.id === editEvent.id ? { ...eventData, id: editEvent.id } : e));
    } else {
      const newEvent = {
        ...eventData,
        id: `event-${Date.now()}`,
        time: selectedTime
      };
      setEvents([...events, newEvent]);
    }
    setShowEventForm(false);
    setEditEvent(null);
    setSelectedTime(null);
  };

  const handleEventDrop = (eventId, newTime) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, time: newTime } : event
    ));
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
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    setShowDeleteConfirm(false);
    setEventToDelete(null);
  };

  const timeRows = Array.from(
    { length: timeline.endEvent - timeline.startEvent + 1 },
    (_, i) => timeline.startEvent + i
  );

  const getEventsForTime = (time) => {
    return events.filter(event => event.time === time);
  };

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
          {timeline.name} - {t('timeline.events')} ({t('timeline.timeUnit')})
        </h2>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="grid grid-cols-[100px_1fr] gap-4">
          {/* Time Column */}
          <div className="border-r border-gray-200">
            {timeRows.map(time => (
              <div key={time} className="h-32 p-4 flex items-center justify-center font-bold">
                {time}
              </div>
            ))}
          </div>

          {/* Events Column */}
          <div className="relative">
            {timeRows.map(time => (
              <div 
                key={time}
                data-time={time}
                className={`h-32 border-b border-gray-200 p-2 relative flex gap-4 timeline-row ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const eventId = e.dataTransfer.getData('eventId');
                  handleEventDrop(eventId, time);
                }}
              >
                {getEventsForTime(time).map(event => (
                  <DraggableEvent
                    key={event.id}
                    event={event}
                    onDrop={handleEventDrop}
                    onEdit={() => handleEditEvent(event)}
                    onDelete={() => handleDeleteEvent(event)}
                    timeRows={timeRows}
                  />
                ))}
                <button
                  onClick={() => handleAddEvent(time)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="fixed inset-0 z-50 bg-opacity-100">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} w-full h-full p-6 overflow-y-auto`}>
            <EventForm
              event={editEvent}
              time={selectedTime}
              onSave={handleSaveEvent}
              onCancel={() => {
                setShowEventForm(false);
                setEditEvent(null);
                setSelectedTime(null);
              }}
              existingEvents={events}
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
          message={t('common.confirmDelete.message', { name: eventToDelete?.name })}
        />
      )}
    </div>
  );
}

export default TimelineEvents;
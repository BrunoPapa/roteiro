// src/components/DraggableEvent.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

function DraggableEvent({ event, onDrop, onEdit, onDelete, timeRows }) {
  const { isDarkMode } = useTheme();

  const handleDragStart = (e) => {
    e.dataTransfer.setData('eventId', event.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        p-4 rounded-lg shadow-md cursor-move
        ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}
        transition-colors duration-200
        min-w-[200px] max-w-[300px]
      `}
    >
      <h3 className="font-bold mb-2">{event.name}</h3>
      <p className="text-sm mb-4 line-clamp-2">
        {event.script.length > 100
          ? event.script.substring(0, 100) + '...'
          : event.script}
      </p>
      <div className="flex justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Excluir
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

export default DraggableEvent;
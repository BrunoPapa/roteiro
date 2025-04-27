// src/components/DeleteConfirmation.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

function DeleteConfirmation({ isOpen, onClose, onConfirm, itemName }) {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-6 rounded-lg max-w-md w-full mx-4`}>
        <p className="text-lg mb-6">
          Você deseja apagar o {itemName}?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
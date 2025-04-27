// src/components/ListLayout.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function ListLayout({ 
  items, 
  columns, 
  onEdit, 
  onDelete, 
  filterField = 'name',
  title,
  onViewEvents 
}) {
  const { isDarkMode } = useTheme();
  const [filterText, setFilterText] = useState('');

  const filteredItems = items.filter(item => 
    item[filterField].toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Filter by ${filterField}...`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className={`p-2 rounded border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          />
          <button
            onClick={() => onEdit(undefined)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            New {title.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <table className="min-w-full">
          <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredItems.map((item, index) => (
              <tr key={item.id || index} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {item[column.field]}
                  </td>
                ))}
                {title === 'Timelines' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewEvents?.(item)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Timeline
                    </button>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListLayout;
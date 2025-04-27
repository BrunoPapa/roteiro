// src/constants/selectOptions.js
export const SELECT_OPTIONS = {
  gender: [
    { id: 1, value: 'male' },
    { id: 2, value: 'female' },
    { id: 3, value: 'non-binary' },
    { id: 4, value: 'other' }
  ],
  eventTime: [
    { id: 1, value: 'morning' },
    { id: 2, value: 'afternoon' },
    { id: 3, value: 'evening' },
    { id: 4, value: 'night' }
  ],
  eventType: [
    { id: 1, value: 'action' },
    { id: 2, value: 'dialogue' },
    { id: 3, value: 'description' },
    { id: 4, value: 'flashback' },
    { id: 5, value: 'other' }
  ]
};

export const getOptionId = (optionType, value) => {
  const option = SELECT_OPTIONS[optionType].find(opt => opt.value === value);
  return option ? option.id : null;
};

export const getOptionValue = (optionType, id) => {
  const option = SELECT_OPTIONS[optionType].find(opt => opt.id === id);
  return option ? option.value : null;
};
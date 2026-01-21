import React, { useState } from 'react';
import Modal from './Modal';

const InputModal = ({ isOpen, onClose, onSave, title, label, placeholder, type = 'number', unit = '' }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value && parseFloat(value) > 0) {
      onSave(parseFloat(value));
      setValue('');
      onClose();
    } else {
      alert('Please enter a valid value.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {unit && `(${unit})`}
          </label>
          <input
            type={type}
            id="input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            required
            min="0"
            step={type === 'number' ? '0.1' : undefined}
            className="input-field"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InputModal;

import React, { useState } from 'react';

const SettingsModal = ({ settings, onSave, onClose }) => {
  const [formState, setFormState] = useState({
    baseUrl: settings.baseUrl,
    apiKey: settings.apiKey,
    model: settings.model
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>API Settings</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="baseUrl">API Base URL</label>
            <input
              type="text"
              id="baseUrl"
              name="baseUrl"
              value={formState.baseUrl}
              onChange={handleChange}
              placeholder="https://api.openai.com/v1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formState.apiKey}
              onChange={handleChange}
              placeholder="Enter your OpenAI API key"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select
              id="model"
              name="model"
              value={formState.model}
              onChange={handleChange}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
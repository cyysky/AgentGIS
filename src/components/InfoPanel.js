import React from 'react';
import '../styles/InfoPanel.css';

const InfoPanel = ({ data, onClose }) => {
  if (!data) return null;
  
  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
    return value;
  };
  
  return (
    <div className="info-panel">
      <div className="info-panel-header">
        <h3>{data.title || 'Feature Information'}</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      
      <div className="info-panel-content">
        {Object.entries(data).map(([key, value]) => {
          if (key === 'title') return null; // Skip title as it's already in the header
          
          return (
            <div key={key} className="info-item">
              <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> 
              <span>{renderValue(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoPanel;
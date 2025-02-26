import React from 'react';

const Header = ({ onSettingsClick }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Geo AI Explorer</h1>
      </div>
      <nav>
        <button onClick={onSettingsClick} className="settings-button">
          Settings
        </button>
      </nav>
    </header>
  );
};

export default Header;
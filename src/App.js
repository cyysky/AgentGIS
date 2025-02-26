import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import ChatBox from './components/ChatBox';
import InfoPanel from './components/InfoPanel';
import SettingsModal from './components/SettingsModal';
import './styles/App.css';

function App() {
  const [mapLayers, setMapLayers] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiSettings, setApiSettings] = useState({
    baseUrl: process.env.REACT_APP_OPENAI_BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
    model: 'gpt-4',
  });
  const [infoPanelData, setInfoPanelData] = useState(null);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);

  const addMapLayer = (layer) => {
    setMapLayers(prevLayers => [...prevLayers, layer]);
  };

  const clearMapLayers = () => {
    setMapLayers([]);
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    setInfoPanelData(feature.properties);
    setInfoPanelVisible(true);
  };

  const handleAIResponse = (response) => {
    // Handle responses from the AI that might include map instructions
    if (response.mapData) {
      addMapLayer(response.mapData);
    }
    
    if (response.infoData) {
      setInfoPanelData(response.infoData);
      setInfoPanelVisible(true);
    }
  };

  return (
    <div className="app">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <div className="main-content">
        <Map 
          layers={mapLayers} 
          onFeatureSelect={handleFeatureSelect}
        />
        
        <div className="sidebar">
          <ChatBox 
            apiSettings={apiSettings}
            onResponse={handleAIResponse}
            onClearMap={clearMapLayers}
          />
          
          {infoPanelVisible && (
            <InfoPanel 
              data={infoPanelData} 
              onClose={() => setInfoPanelVisible(false)}
            />
          )}
        </div>
      </div>
      
      {showSettings && (
        <SettingsModal
          settings={apiSettings}
          onSave={(newSettings) => {
            setApiSettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ layers, onFeatureSelect }) => {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const layerControls = useRef(null);
  const layerRefs = useRef({});
  const [position, setPosition] = useState({ lat: 5.9804, lng: 116.0735 }); // Kota Kinabalu, Sabah

  // Initialize map
  useEffect(() => {
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([position.lat, position.lng], 12);
      
      // Add base layers (Google-like maps)
      const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      
      const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
      
      const baseMaps = {
        "Streets": streets,
        "Satellite": satellite
      };
      
      streets.addTo(leafletMap.current);
      
      // Add layer control
      layerControls.current = L.control.layers(baseMaps, {}).addTo(leafletMap.current);
      
      // Add scale control
      L.control.scale().addTo(leafletMap.current);
    }
    
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);
  
  // Handle new layers
  useEffect(() => {
    if (!leafletMap.current) return;
    
    // Clean up old layers
    Object.values(layerRefs.current).forEach(layer => {
      leafletMap.current.removeLayer(layer);
      if (layerControls.current) {
        layerControls.current.removeLayer(layer);
      }
    });
    
    layerRefs.current = {};
    
    // Add new layers
    layers.forEach((layerData, index) => {
      if (!layerData) return;
      
      let layer;
      const layerId = `layer-${index}`;
      
      if (layerData.type === 'polygon' || layerData.type === 'geojson') {
        layer = L.geoJSON(layerData.data, {
          style: layerData.style || {
            color: '#3388ff',
            weight: 2,
            opacity: 0.8,
            fillColor: '#3388ff',
            fillOpacity: 0.3
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties) {
              const popupContent = Object.entries(feature.properties)
                .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                .join('<br>');
                
              layer.bindPopup(popupContent);
              
              layer.on('click', () => {
                if (onFeatureSelect) {
                  onFeatureSelect(feature);
                }
              });
            }
          }
        });
      } else if (layerData.type === 'marker') {
        layer = L.marker([layerData.lat, layerData.lng]);
        if (layerData.popup) {
          layer.bindPopup(layerData.popup);
        }
      } else if (layerData.type === 'heatmap' && window.L.heatLayer) {
        layer = L.heatLayer(layerData.points, layerData.options);
      }
      
      if (layer) {
        layer.addTo(leafletMap.current);
        layerRefs.current[layerId] = layer;
        
        if (layerControls.current) {
          layerControls.current.addOverlay(layer, layerData.name || `Layer ${index + 1}`);
        }
        
        // If the layer has bounds, fit the map to those bounds
        if (layerData.bounds) {
          leafletMap.current.fitBounds(layerData.bounds);
        } else if (layer.getBounds && !layer.getBounds().isEmpty()) {
          leafletMap.current.fitBounds(layer.getBounds());
        }
      }
    });
  }, [layers, onFeatureSelect]);
  
  return <div id="map" ref={mapRef} className="map-container"></div>;
};

export default Map;
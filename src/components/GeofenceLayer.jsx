import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

function GeofenceLayer({ geofences, onDelete }) {
  const map = useMap()

  useEffect(() => {
    const layers = []
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
      '#06b6d4', '#f97316', '#84cc16', '#6366f1', '#14b8a6'
    ]

    geofences.forEach((geofence, index) => {
      if (!geofence.polygon) return

      const polygon = geofence.polygon
      const name = geofence.name || geofence.hook || `Geofence ${index}`
      const color = colors[index % colors.length]
      
      // Use stroke properties from geofence if available
      const strokeColor = geofence.strokeColor || '#1e40af'
      const strokeWidth = geofence.strokeWidth !== null && geofence.strokeWidth !== undefined ? geofence.strokeWidth : 2
      const strokeOpacity = geofence.strokeOpacity !== null && geofence.strokeOpacity !== undefined ? geofence.strokeOpacity : 0.8

      // Extract geofence name from hook if available
      let displayName = name
      if (name.includes('_')) {
        const parts = name.split('_')
        if (parts.length >= 3) {
          displayName = parts[2] // Extract from geofence_{mac}_{name}
        }
      }

      const layer = L.geoJSON(polygon, {
        style: {
          color: strokeColor,
          fillColor: color,
          fillOpacity: 0.3,
          weight: strokeWidth,
          opacity: strokeOpacity
        }
      })

      // Label removed - no longer showing geofence names on map

      layer.bindPopup(`
        <div style="min-width: 200px;">
          <strong>Geofence: ${displayName}</strong><br/>
          ${geofence.mac ? `Badge MAC: ${geofence.mac}<br/>` : ''}
          <button onclick="window.deleteGeofence('${name}')" style="
            margin-top: 8px;
            padding: 4px 8px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">Delete</button>
        </div>
      `)

      layer.addTo(map)
      layers.push(layer)
    })

    // Make delete function available globally for popup buttons
    window.deleteGeofence = onDelete

    return () => {
      layers.forEach(layer => map.removeLayer(layer))
      delete window.deleteGeofence
    }
  }, [geofences, map, onDelete])

  return null
}

export default GeofenceLayer


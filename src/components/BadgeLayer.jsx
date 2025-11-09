import React, { useEffect, useMemo } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { createCirclePolygon } from '../utils/geometry'

// Generate a unique color for each badge based on MAC address
// Uses a better hash function to minimize collisions
function getBadgeColor(mac, usedColors = new Set()) {
  // Expanded color palette with more distinct colors
  const colors = [
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#f59e0b', // Amber/Orange
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime Green
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#eab308', // Yellow
    '#a855f7', // Violet
    '#f43f5e', // Rose
    '#22c55e', // Emerald
    '#0ea5e9', // Sky Blue
    '#dc2626', // Dark Red
    '#2563eb', // Dark Blue
    '#059669', // Dark Green
    '#d97706', // Dark Amber
    '#7c3aed', // Dark Purple
    '#db2777', // Dark Pink
    '#0891b2', // Dark Cyan
    '#ea580c', // Dark Orange
    '#65a30d', // Dark Lime
    '#4f46e5', // Dark Indigo
    '#0d9488', // Dark Teal
    '#ca8a04', // Dark Yellow
    '#9333ea', // Dark Violet
    '#e11d48', // Dark Rose
    '#16a34a', // Dark Emerald
    '#0284c7', // Dark Sky
  ]
  
  // Better hash function using djb2 algorithm
  let hash = 5381
  for (let i = 0; i < mac.length; i++) {
    hash = ((hash << 5) + hash) + mac.charCodeAt(i)
  }
  
  // Try to find an unused color first
  let index = Math.abs(hash) % colors.length
  let attempts = 0
  const maxAttempts = colors.length
  
  // If color is already used, try next colors
  while (usedColors.has(colors[index]) && attempts < maxAttempts) {
    index = (index + 1) % colors.length
    attempts++
  }
  
  return colors[index]
}

function BadgeLayer({ badges, selectedBadge, onSelect, showAnimations }) {
  const map = useMap()

  // Pre-calculate unique colors for all badges
  // Process badges in order and track used colors to avoid collisions
  const badgeColors = useMemo(() => {
    const colorMap = new Map()
    const usedColors = new Set()
    
    // First pass: assign colors to all badges
    badges.forEach(badge => {
      const mac = badge.mac || badge.id
      if (mac && !colorMap.has(mac)) {
        const color = getBadgeColor(mac, usedColors)
        colorMap.set(mac, color)
        usedColors.add(color)
      }
    })
    
    // Second pass: if any collisions detected, reassign
    const colorUsage = new Map()
    colorMap.forEach((color, mac) => {
      if (!colorUsage.has(color)) {
        colorUsage.set(color, [])
      }
      colorUsage.get(color).push(mac)
    })
    
    // Reassign colors for any MACs that share a color
    colorUsage.forEach((macs, color) => {
      if (macs.length > 1) {
        // Multiple MACs share this color, reassign extras
        const availableColors = [
          '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4',
          '#f97316', '#84cc16', '#6366f1', '#14b8a6', '#eab308', '#a855f7',
          '#f43f5e', '#22c55e', '#0ea5e9', '#dc2626', '#2563eb', '#059669',
          '#d97706', '#7c3aed', '#db2777', '#0891b2', '#ea580c', '#65a30d',
          '#4f46e5', '#0d9488', '#ca8a04', '#9333ea', '#e11d48', '#16a34a', '#0284c7'
        ]
        
        // Keep first MAC with original color, reassign others
        for (let i = 1; i < macs.length; i++) {
          const mac = macs[i]
          // Find an unused color
          for (const newColor of availableColors) {
            if (!usedColors.has(newColor)) {
              colorMap.set(mac, newColor)
              usedColors.add(newColor)
              break
            }
          }
        }
      }
    })
    
    return colorMap
  }, [badges])

  useEffect(() => {
    const layers = []
    const markers = []

    badges.forEach(badge => {
      if (!badge.latitude || !badge.longitude) return

      const lat = badge.latitude
      const lon = badge.longitude
      const mac = badge.mac || badge.id
      const radius = badge.radius
      const isSelected = selectedBadge === mac

      // Get unique base color for this badge
      const baseColor = badgeColors.get(mac) || '#ef4444'
      
      // Determine badge status color - use base color but adjust for status
      let badgeColor = baseColor
      let circleColor = baseColor
      let circleOpacity = 0.2

      if (badge.status) {
        const statuses = Object.values(badge.status)
        if (statuses.includes('inside') || statuses.includes('enter')) {
          // Keep base color but make it brighter/more saturated for inside
          badgeColor = baseColor
          circleColor = baseColor
          circleOpacity = 0.3
        } else if (statuses.includes('cross')) {
          // Use a darker version for crossing
          badgeColor = baseColor
          circleColor = baseColor
          circleOpacity = 0.25
        } else {
          // Outside - use base color with lower opacity
          badgeColor = baseColor
          circleColor = baseColor
          circleOpacity = 0.15
        }
      }

      // Create circle if radius exists
      if (radius) {
        const radiusMeters = radius * 0.3048 // Convert feet to meters
        const circlePolygon = createCirclePolygon(lat, lon, radiusMeters, 32)
        
        const circleLayer = L.geoJSON(circlePolygon, {
          style: {
            color: circleColor,
            fillColor: circleColor,
            fillOpacity: circleOpacity,
            weight: isSelected ? 3 : 2,
            opacity: isSelected ? 0.8 : 0.6
          }
        })

        // Add pulsing animation for recent events
        if (showAnimations && badge.lastEvent) {
          const eventTime = new Date(badge.lastEvent.timestamp).getTime()
          const now = Date.now()
          const timeSinceEvent = now - eventTime
          
          if (timeSinceEvent < 5000) { // Animate for 5 seconds
            const eventType = badge.lastEvent.detect
            let animationColor = circleColor
            
            // Use base color but adjust opacity/brightness for events
            if (eventType === 'enter') {
              animationColor = baseColor // Keep unique color, just brighter
            } else if (eventType === 'exit') {
              animationColor = baseColor // Keep unique color
            } else if (eventType === 'cross') {
              animationColor = baseColor // Keep unique color
            }
            
            circleLayer.setStyle({
              color: animationColor,
              fillColor: animationColor,
              fillOpacity: 0.4,
              weight: 4
            })
            
            // Pulse animation
            let pulse = true
            const pulseInterval = setInterval(() => {
              pulse = !pulse
              circleLayer.setStyle({
                fillOpacity: pulse ? 0.4 : 0.2,
                weight: pulse ? 4 : 3
              })
            }, 500)
            
            setTimeout(() => {
              clearInterval(pulseInterval)
              circleLayer.setStyle({
                color: circleColor,
                fillColor: circleColor,
                fillOpacity: circleOpacity,
                weight: isSelected ? 3 : 2
              })
            }, 5000)
          }
        }

        circleLayer.bindPopup(`
          <div style="min-width: 200px;">
            <strong>Badge: ${mac}</strong><br/>
            Position: ${lat.toFixed(6)}, ${lon.toFixed(6)}<br/>
            Radius: ${radius} ft (${(radius * 0.3048).toFixed(2)} m)<br/>
            ${badge.timestamp ? `Updated: ${new Date(badge.timestamp).toLocaleString()}<br/>` : ''}
            ${badge.status ? `Status: ${Object.entries(badge.status).map(([k, v]) => `${k}: ${v}`).join(', ')}` : ''}
          </div>
        `)
        
        circleLayer.on('click', () => onSelect(mac))
        circleLayer.addTo(map)
        layers.push(circleLayer)
      }

      // Create marker for badge center
      const markerIcon = L.divIcon({
        className: 'badge-marker',
        html: `
          <div style="
            width: ${isSelected ? '20px' : '16px'};
            height: ${isSelected ? '20px' : '16px'};
            background: ${badgeColor};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ${isSelected ? 'box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);' : ''}
          "></div>
        `,
        iconSize: [isSelected ? 20 : 16, isSelected ? 20 : 16],
        iconAnchor: [isSelected ? 10 : 8, isSelected ? 10 : 8]
      })

      const marker = L.marker([lat, lon], { icon: markerIcon })
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <strong>Badge: ${mac}</strong><br/>
          Position: ${lat.toFixed(6)}, ${lon.toFixed(6)}<br/>
          ${radius ? `Radius: ${radius} ft (${(radius * 0.3048).toFixed(2)} m)<br/>` : 'No radius<br/>'}
          ${badge.timestamp ? `Updated: ${new Date(badge.timestamp).toLocaleString()}<br/>` : ''}
          ${badge.status ? `Status: ${Object.entries(badge.status).map(([k, v]) => `${k}: ${v}`).join(', ')}` : ''}
        </div>
      `)
      
      marker.on('click', () => onSelect(mac))
      marker.addTo(map)
      markers.push(marker)

      // Draw trail if history exists
      if (badge.history && badge.history.length > 1) {
        const trailCoords = badge.history.map(h => [h.lat, h.lon])
        const trail = L.polyline(trailCoords, {
          color: badgeColor,
          weight: 2,
          opacity: 0.5,
          dashArray: '5, 5'
        })
        trail.addTo(map)
        layers.push(trail)
      }
    })

    return () => {
      layers.forEach(layer => map.removeLayer(layer))
      markers.forEach(marker => map.removeLayer(marker))
    }
  }, [badges, selectedBadge, map, onSelect, showAnimations, badgeColors])

  return null
}

export default BadgeLayer


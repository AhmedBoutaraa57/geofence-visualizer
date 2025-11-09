import React from 'react'
import './EventLog.css'

function EventLog({ events }) {
  const getEventColor = (detect) => {
    switch (detect) {
      case 'enter':
        return '#10b981' // Green
      case 'exit':
        return '#ef4444' // Red
      case 'cross':
        return '#f59e0b' // Yellow
      case 'inside':
        return '#3b82f6' // Blue
      case 'outside':
        return '#6b7280' // Gray
      default:
        return '#6b7280'
    }
  }

  const getEventIcon = (detect) => {
    switch (detect) {
      case 'enter':
        return '→'
      case 'exit':
        return '←'
      case 'cross':
        return '↔'
      case 'inside':
        return '●'
      case 'outside':
        return '○'
      default:
        return '•'
    }
  }

  return (
    <div className="event-log">
      <h2>Event Log ({events.length})</h2>
      <div className="event-list">
        {events.length === 0 ? (
          <div className="no-events">No events yet</div>
        ) : (
          events.map((event, index) => {
            const timestamp = event.timestamp || event.time || new Date().toISOString()
            const detect = event.detect || event.type || 'unknown'
            const badgeId = event.id || event.mac || 'unknown'
            const hook = event.hook || event.geofence_name || 'unknown'
            
            // Extract geofence name from hook
            let geofenceName = hook
            if (hook.includes('_')) {
              const parts = hook.split('_')
              if (parts.length >= 3) {
                geofenceName = parts[2]
              }
            }

            return (
              <div key={index} className="event-item">
                <div className="event-header">
                  <span
                    className="event-type"
                    style={{ color: getEventColor(detect) }}
                  >
                    {getEventIcon(detect)} {detect.toUpperCase()}
                  </span>
                  <span className="event-time">
                    {new Date(timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="event-details">
                  <div><strong>Badge:</strong> {badgeId}</div>
                  <div><strong>Geofence:</strong> {geofenceName}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default EventLog


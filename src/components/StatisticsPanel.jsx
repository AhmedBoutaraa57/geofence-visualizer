import React, { useMemo } from 'react'
import './StatisticsPanel.css'

function StatisticsPanel({ badges, geofences, events }) {
  const stats = useMemo(() => {
    const badgeCount = badges.size
    const geofenceCount = geofences.size
    
    // Count badges by status
    let insideCount = 0
    let outsideCount = 0
    let crossCount = 0
    
    badges.forEach(badge => {
      if (badge.status) {
        const statuses = Object.values(badge.status)
        if (statuses.includes('inside') || statuses.includes('enter')) {
          insideCount++
        } else if (statuses.includes('cross')) {
          crossCount++
        } else {
          outsideCount++
        }
      } else {
        outsideCount++
      }
    })
    
    // Count events by type
    const eventCounts = {
      enter: 0,
      exit: 0,
      cross: 0,
      inside: 0,
      outside: 0
    }
    
    events.forEach(event => {
      const detect = event.detect || event.type
      if (eventCounts.hasOwnProperty(detect)) {
        eventCounts[detect]++
      }
    })
    
    // Calculate events per minute (last 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    const recentEvents = events.filter(event => {
      const timestamp = event.timestamp || event.time
      if (!timestamp) return false
      return new Date(timestamp).getTime() > fiveMinutesAgo
    })
    const eventsPerMinute = recentEvents.length / 5
    
    return {
      badgeCount,
      geofenceCount,
      insideCount,
      outsideCount,
      crossCount,
      eventCounts,
      totalEvents: events.length,
      eventsPerMinute: eventsPerMinute.toFixed(1)
    }
  }, [badges, geofences, events])

  return (
    <div className="statistics-panel">
      <h2>Statistics</h2>
      
      <div className="stat-group">
        <div className="stat-item">
          <div className="stat-label">Badges</div>
          <div className="stat-value">{stats.badgeCount}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Geofences</div>
          <div className="stat-value">{stats.geofenceCount}</div>
        </div>
      </div>

      <div className="stat-group">
        <h3>Badge Status</h3>
        <div className="stat-item">
          <div className="stat-label">Inside</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.insideCount}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Outside</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            {stats.outsideCount}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Crossing</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.crossCount}
          </div>
        </div>
      </div>

      <div className="stat-group">
        <h3>Events</h3>
        <div className="stat-item">
          <div className="stat-label">Total</div>
          <div className="stat-value">{stats.totalEvents}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Per Minute</div>
          <div className="stat-value">{stats.eventsPerMinute}</div>
        </div>
        <div className="event-breakdown">
          <div className="event-stat">
            <span style={{ color: '#10b981' }}>●</span> Enter: {stats.eventCounts.enter}
          </div>
          <div className="event-stat">
            <span style={{ color: '#ef4444' }}>●</span> Exit: {stats.eventCounts.exit}
          </div>
          <div className="event-stat">
            <span style={{ color: '#f59e0b' }}>●</span> Cross: {stats.eventCounts.cross}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPanel


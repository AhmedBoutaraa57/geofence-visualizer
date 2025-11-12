import React, { useState, useMemo } from 'react'
import './NotificationHistory.css'

function NotificationHistory({ notifications, onClear, onClose }) {
  const [filter, setFilter] = useState('all') // 'all', 'enter', 'exit'
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(n => 
        n.message.toLowerCase().includes(term) ||
        n.badgeId?.toLowerCase().includes(term) ||
        n.geofenceName?.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [notifications, filter, searchTerm])

  const getEventColor = (type) => {
    switch (type) {
      case 'enter':
        return '#10b981'
      case 'exit':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'enter':
        return '→'
      case 'exit':
        return '←'
      default:
        return '•'
    }
  }

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      enter: notifications.filter(n => n.type === 'enter').length,
      exit: notifications.filter(n => n.type === 'exit').length
    }
  }, [notifications])

  return (
    <div className="notification-history">
      <div className="notification-history-header">
        <h2>Notification History</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="notification-history-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ color: '#10b981' }}>Enter:</span>
          <span className="stat-value">{stats.enter}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ color: '#ef4444' }}>Exit:</span>
          <span className="stat-value">{stats.exit}</span>
        </div>
      </div>

      <div className="notification-history-filters">
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'enter' ? 'active' : ''}
            onClick={() => setFilter('enter')}
          >
            Enter
          </button>
          <button 
            className={filter === 'exit' ? 'active' : ''}
            onClick={() => setFilter('exit')}
          >
            Exit
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by badge or geofence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="notification-history-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            {notifications.length === 0 
              ? 'No notifications yet' 
              : 'No notifications match your filters'}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className="notification-history-item"
              style={{ borderLeftColor: getEventColor(notification.type) }}
            >
              <div className="notification-history-item-header">
                <span 
                  className="notification-history-icon"
                  style={{ color: getEventColor(notification.type) }}
                >
                  {getEventIcon(notification.type)}
                </span>
                <span className="notification-history-type">
                  {notification.type.toUpperCase()}
                </span>
                <span className="notification-history-time">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="notification-history-message">
                {notification.message}
              </div>
              {notification.badgeId && notification.geofenceName && (
                <div className="notification-history-details">
                  <span>Badge: <strong>{notification.badgeId}</strong></span>
                  <span>Geofence: <strong>{notification.geofenceName}</strong></span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-history-footer">
          <button className="clear-button" onClick={onClear}>
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationHistory


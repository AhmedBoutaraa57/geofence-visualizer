import React, { useEffect } from 'react'
import './Notification.css'

function Notification({ message, type, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'enter':
        return '→'
      case 'exit':
        return '←'
      default:
        return '•'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'enter':
        return '#10b981' // Green
      case 'exit':
        return '#ef4444' // Red
      default:
        return '#6b7280' // Gray
    }
  }

  return (
    <div className="notification" style={{ borderLeftColor: getColor() }}>
      <div className="notification-content">
        <span className="notification-icon" style={{ color: getColor() }}>
          {getIcon()}
        </span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  )
}

export default Notification


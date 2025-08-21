import React from 'react'

function Alert({ type = 'info', message, onClose }) {
  if (!message) return null

  return (
    <div className={`alert ${type}`}>
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            padding: '4px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert

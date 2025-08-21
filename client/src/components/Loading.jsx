import React from 'react'

function Loading({ fullScreen = false, message = 'Loading...' }) {
  const content = (
    <div className="loading">
      <div>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: '#a7b4d7' }}>{message}</p>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0b1320 0%, #1a2332 100%)'
      }}>
        {content}
      </div>
    )
  }

  return content
}

export default Loading

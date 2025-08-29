import React from 'react'

function Navigation({ user, onLogout, activeTab, onTabChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'payouts', label: 'Create Payout', icon: '➕' },
    { id: 'history', label: 'Payout History', icon: '📋' }
  ]

  if (user.role === 'admin') {
    navItems.push({ id: 'users', label: 'Users', icon: '👥' })
  }

  return (
    <div className="nav">
      <div className="nav-brand">
        <span>💳</span>
        <span>Worldpay Payouts</span>
        <span className={`badge ${user.role}`}>{user.role}</span>
      </div>
      
      <div className="nav-links">
        {navItems.map(item => (
          <button 
            key={item.id}
            className={activeTab === item.id ? 'active' : 'secondary'}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
        
        <button className="secondary logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Navigation
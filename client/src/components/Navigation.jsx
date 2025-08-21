import React from 'react'

function Navigation({ user, onLogout, activeTab, onTabChange }) {
  return (
    <div className="nav">
      <div className="nav-brand">
        <span>💳</span>
        <span>Worldpay Payouts</span>
        <span className={`badge ${user.role}`}>{user.role}</span>
      </div>

      <div className="nav-links">
        <button 
          className={activeTab === 'payouts' ? '' : 'secondary'}
          onClick={() => onTabChange('payouts')}
        >
          Payouts
        </button>

        {user.role === 'admin' && (
          <button 
            className={activeTab === 'users' ? '' : 'secondary'}
            onClick={() => onTabChange('users')}
          >
            Users
          </button>
        )}

        <button className="secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navigation

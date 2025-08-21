import React, { useState } from 'react'
import Navigation from '../components/Navigation'
import Payouts from './Payouts'
import Users from './Users'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('payouts')

  return (
    <div className="container">
      <Navigation 
        user={user}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'payouts' && <Payouts user={user} />}
      {activeTab === 'users' && user.role === 'admin' && <Users />}
    </div>
  )
}

export default Dashboard

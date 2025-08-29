import React, { useState } from 'react'
import Navigation from '../components/Navigation'
import DashboardHome from './DashboardHome'
import Payouts from './Payouts'
import PayoutHistory from './PayoutHistory'
import Users from './Users'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container">
      <Navigation 
        user={user}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === 'dashboard' && <DashboardHome user={user} onNavigate={setActiveTab} />}
      {activeTab === 'payouts' && <Payouts user={user} />}
      {activeTab === 'history' && <PayoutHistory user={user} />}
      {activeTab === 'users' && user.role === 'admin' && <Users />}
    </div>
  )
}

export default Dashboard
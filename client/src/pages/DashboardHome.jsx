import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import Loading from '../components/Loading'
import Alert from '../components/Alert'

function DashboardHome({ user, onNavigate }) {
  const [stats, setStats] = useState({
    accountBalance: 0,
    totalPayouts: 0,
    successfulPayouts: 0,
    pendingPayouts: 0,
    totalAmount: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const payouts = await api.getPayouts()

      // Calculate statistics
      const totalPayouts = payouts.length
      const successfulPayouts = payouts.filter(p => 
        p.status === 'processed' || p.status === 'completed'
      ).length
      const pendingPayouts = payouts.filter(p => 
        p.status === 'pending' || p.status === 'submitted'
      ).length
      const totalAmount = payouts.reduce((sum, p) => sum + (p.amount_cents / 100), 0)
      
      // Recent activity (last 5 payouts)
      const recentActivity = payouts.slice(0, 5).map(payout => ({
        id: payout.id,
        type: 'payout',
        description: `Payout to ${payout.beneficiary_name}`,
        amount: payout.amount_cents / 100,
        currency: payout.currency,
        status: payout.status,
        date: new Date(payout.created_at).toLocaleDateString()
      }))

      setStats({
        accountBalance: 125000.00, // Mock balance - you can add real API later
        totalPayouts,
        successfulPayouts,
        pendingPayouts,
        totalAmount,
        recentActivity
      })
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  if (loading) {
    return <Loading message="Loading dashboard..." />
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Here's an overview of your account activity</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Key Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Account Balance</h3>
            <div className="stat-value">{formatCurrency(stats.accountBalance)}</div>
            <div className="stat-change positive">Available for payouts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Payouts</h3>
            <div className="stat-value">{stats.totalPayouts}</div>
            <div className="stat-change">{stats.successfulPayouts} successful</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Payouts</h3>
            <div className="stat-value">{stats.pendingPayouts}</div>
            <div className="stat-change">Awaiting processing</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Transferred</h3>
            <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
            <div className="stat-change">All time total</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-2" style={{ marginTop: '30px' }}>
        <div className="card">
          <h3>Recent Activity</h3>
          {stats.recentActivity.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            <div className="activity-list">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-details">
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-date">{activity.date}</div>
                  </div>
                  <div className="activity-amount">
                    <div className="amount">{formatCurrency(activity.amount, activity.currency)}</div>
                    <span className={`badge ${activity.status}`}>{activity.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button 
                className="action-btn primary"
                onClick={() => onNavigate('payouts')}
              >
                <span>➕</span>
                Create New Payout
              </button>
              <button 
                className="action-btn"
                onClick={() => onNavigate('history')}
              >
                <span>📋</span>
                View Payout History
              </button>
              <button 
                className="action-btn"
                onClick={() => alert('Download report feature coming soon!')}
              >
                <span>📊</span>
                Download Report
              </button>
              {user.role === 'admin' && (
                <button 
                  className="action-btn"
                  onClick={() => onNavigate('users')}
                >
                  <span>👥</span>
                  Manage Users
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome

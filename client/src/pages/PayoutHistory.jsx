import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import Alert from '../components/Alert'
import Loading from '../components/Loading'

function PayoutHistory({ user }) {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPayouts()
  }, [])

  const loadPayouts = async () => {
    try {
      setLoading(true)
      const data = await api.getPayouts()
      setPayouts(data)
    } catch (err) {
      setError('Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async (id) => {
    try {
      await api.refreshPayoutStatus(id)
      await loadPayouts()
      setSuccess('Status refreshed')
    } catch (err) {
      setError('Failed to refresh status')
    }
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter payouts based on status and search term
  const filteredPayouts = payouts.filter(payout => {
    const matchesFilter = filter === 'all' || payout.status === filter
    const matchesSearch = searchTerm === '' || 
      payout.beneficiary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
    <div className="payout-history">
      <div className="page-header">
        <h2>Payout History</h2>
        <p>View and manage all your payout transactions</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Payouts</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="processed">Processed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by beneficiary or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button onClick={loadPayouts} className="refresh-btn">
          🔄 Refresh All
        </button>
      </div>

      {/* Payouts Table */}
      <div className="card">
        {loading ? (
          <Loading />
        ) : filteredPayouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No payouts found</h3>
            <p>
              {payouts.length === 0 
                ? "You haven't created any payouts yet." 
                : "No payouts match your current filters."
              }
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Beneficiary</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>#{payout.id}</td>
                    <td>{formatDate(payout.created_at)}</td>
                    <td>
                      <div className="beneficiary-info">
                        <div className="beneficiary-name">{payout.beneficiary_name}</div>
                        <div className="beneficiary-account">{payout.beneficiary_account}</div>
                      </div>
                    </td>
                    <td className="amount-cell">
                      {formatCurrency(payout.amount_cents, payout.currency)}
                    </td>
                    <td>{payout.reference || '-'}</td>
                    <td>
                      <span className={`badge ${payout.status}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="secondary small"
                          onClick={() => handleRefresh(payout.id)}
                        >
                          🔄 Refresh
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && filteredPayouts.length > 0 && (
        <div className="summary-stats">
          <div className="stat">
            <strong>Total Payouts:</strong> {filteredPayouts.length}
          </div>
          <div className="stat">
            <strong>Total Amount:</strong> {formatCurrency(
              filteredPayouts.reduce((sum, p) => sum + p.amount_cents, 0), 
              'USD'
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PayoutHistory

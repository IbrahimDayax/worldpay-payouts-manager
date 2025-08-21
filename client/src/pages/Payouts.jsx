import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import Alert from '../components/Alert'
import Loading from '../components/Loading'

function Payouts({ user }) {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    amount: '100.00',
    currency: 'USD',
    beneficiaryName: 'John Doe',
    beneficiaryAccount: '123456789',
    beneficiaryBank: 'Demo Bank',
    reference: 'Test payout'
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreating(true)

    try {
      await api.createPayout(formData)
      setSuccess('Payout created successfully!')
      await loadPayouts()
    } catch (err) {
      setError(err.error || 'Failed to create payout')
    } finally {
      setCreating(false)
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <div className="card">
        <h3>Create New Payout</h3>
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-3">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reference</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Beneficiary Name</label>
              <input
                type="text"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="beneficiaryAccount"
                value={formData.beneficiaryAccount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                name="beneficiaryBank"
                value={formData.beneficiaryBank}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create Payout'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Payout History</h3>
        {loading ? (
          <Loading />
        ) : payouts.length === 0 ? (
          <p>No payouts yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Beneficiary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td>#{payout.id}</td>
                  <td>{(payout.amount_cents / 100).toFixed(2)} {payout.currency}</td>
                  <td>{payout.beneficiary_name}</td>
                  <td><span className={`badge ${payout.status}`}>{payout.status}</span></td>
                  <td>
                    <button className="secondary" onClick={() => handleRefresh(payout.id)}>
                      Refresh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Payouts

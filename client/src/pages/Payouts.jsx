import React, { useState } from 'react'
import { api } from '../services/api'
import Alert from '../components/Alert'

function Payouts({ user }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreating(true)

    try {
      await api.createPayout(formData)
      setSuccess('Payout created successfully!')
      // Reset form
      setFormData({
        amount: '',
        currency: 'USD',
        beneficiaryName: '',
        beneficiaryAccount: '',
        beneficiaryBank: '',
        reference: ''
      })
    } catch (err) {
      setError(err.error || 'Failed to create payout')
    } finally {
      setCreating(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="create-payout">
      <div className="page-header">
        <h2>Create New Payout</h2>
        <p>Send money to beneficiaries worldwide</p>
      </div>

      <div className="card">
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-3">
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label>Currency *</label>
              <select name="currency" value={formData.currency} onChange={handleChange} required>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Reference</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Payment reference"
              />
            </div>
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label>Beneficiary Name *</label>
              <input
                type="text"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleChange}
                required
                placeholder="Full name of recipient"
              />
            </div>
            
            <div className="form-group">
              <label>Account Number *</label>
              <input
                type="text"
                name="beneficiaryAccount"
                value={formData.beneficiaryAccount}
                onChange={handleChange}
                required
                placeholder="Bank account number or IBAN"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              name="beneficiaryBank"
              value={formData.beneficiaryBank}
              onChange={handleChange}
              placeholder="Name of recipient's bank"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={creating} className="primary">
              {creating ? 'Creating Payout...' : 'Create Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Payouts
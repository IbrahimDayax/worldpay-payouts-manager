import React, { useState } from 'react'
import { api } from '../services/api'
import Alert from '../components/Alert'

function Payouts({ user }) {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    beneficiaryName: '',
    beneficiaryTitle: 'mr',
    beneficiaryAccount: '',
    routingNumber: '',
    accountType: 'checking',
    beneficiaryType: 'Person',
    beneficiaryBank: '',
    reference: '',
    countryCode: 'US'
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
        beneficiaryTitle: 'mr',
        beneficiaryAccount: '',
        routingNumber: '',
        accountType: 'checking',
        beneficiaryType: 'Person',
        beneficiaryBank: '',
        reference: '',
        countryCode: 'US'
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
              <label>Country *</label>
              <select name="countryCode" value={formData.countryCode} onChange={handleChange} required>
                <option value="US">US - United States</option>
                <option value="CA">CA - Canada</option>
                <option value="GB">GB - United Kingdom</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label>Beneficiary Type *</label>
              <select 
                name="beneficiaryType" 
                value={formData.beneficiaryType} 
                onChange={handleChange}
                required
              >
                <option value="Person">Person</option>
                <option value="Company">Company</option>
              </select>
            </div>

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
          </div>

          {formData.beneficiaryType === 'Person' && (
            <div className="form-group">
              <label>Title *</label>
              <select 
                name="beneficiaryTitle" 
                value={formData.beneficiaryTitle} 
                onChange={handleChange}
                required
              >
                <option value="mr">Mr</option>
                <option value="mrs">Mrs</option>
                <option value="ms">Ms</option>
                <option value="miss">Miss</option>
                <option value="dr">Dr</option>
                <option value="mx">Mx</option>
                <option value="misc">Misc</option>
              </select>
            </div>
          )}

          <div className="grid grid-3">
            <div className="form-group">
              <label>Account Number *</label>
              <input
                type="text"
                name="beneficiaryAccount"
                value={formData.beneficiaryAccount}
                onChange={handleChange}
                required
                placeholder="Bank account number"
              />
            </div>

            <div className="form-group">
              <label>Routing Number *</label>
              <input
                type="text"
                name="routingNumber"
                value={formData.routingNumber}
                onChange={handleChange}
                required
                placeholder="9-digit routing number"
                maxLength="9"
              />
            </div>

            <div className="form-group">
              <label>Account Type *</label>
              <select 
                name="accountType" 
                value={formData.accountType} 
                onChange={handleChange}
                required
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-2">
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

            <div className="form-group">
              <label>Reference (min 6 characters)</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Payment reference"
                minLength="6"
              />
            </div>
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
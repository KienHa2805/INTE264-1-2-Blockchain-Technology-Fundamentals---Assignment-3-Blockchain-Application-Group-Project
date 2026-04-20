import React, { useState } from 'react';
import { submitIoC } from '../utils';
import './IoCSubmissionForm.css';

function IoCSubmissionForm({ userAccount, onSuccess, onError, onLoading }) {
  const [threatIndicator, setThreatIndicator] = useState('');
  const [category, setCategory] = useState('IP Address');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = [
    { value: 'IP Address', label: '📍 IP Address', placeholder: 'e.g., 192.168.1.1' },
    { value: 'Domain Name', label: '🌐 Domain Name', placeholder: 'e.g., malicious-site.com' },
    { value: 'Phone Number', label: '☎️ Phone Number', placeholder: 'e.g., +1-555-0123' },
    { value: 'Malware Hash', label: '🔐 Malware Hash', placeholder: 'e.g., a1b2c3d4e5f6...' },
  ];

  const currentOption = categoryOptions.find(opt => opt.value === category);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!threatIndicator.trim()) {
      onError('Please enter a threat indicator');
      return;
    }

    if (!category) {
      onError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    onLoading(true);

    try {
      await submitIoC(threatIndicator, category);
      onSuccess(`✓ Threat indicator "${threatIndicator}" (${category}) submitted successfully!`);
      setThreatIndicator('');
      setCategory('IP Address');
    } catch (err) {
      console.error('Submission error:', err);
      let errorMsg = err.reason || err.message || 'Failed to submit threat indicator';
      
      // Handle specific error messages
      if (errorMsg.includes('already exists')) {
        errorMsg = `✗ This threat indicator has already been submitted to the ledger. Duplicate submissions are not allowed.`;
      }
      
      onError(errorMsg);
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="category">
            Category
            <span className="required">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
            className="category-select"
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: 2 }}>
          <label htmlFor="threatIndicator">
            Threat Indicator
            <span className="required">*</span>
          </label>
          <input
            id="threatIndicator"
            type="text"
            placeholder={currentOption?.placeholder || 'Enter threat indicator'}
            value={threatIndicator}
            onChange={(e) => setThreatIndicator(e.target.value)}
            disabled={isSubmitting}
            maxLength="256"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-submit"
        disabled={isSubmitting || !threatIndicator.trim()}
      >
        {isSubmitting ? 'Submitting...' : '📤 Submit Threat Indicator'}
      </button>

      <div className="submission-info">
        <p>
          <strong>📌 Note:</strong> Your submission will be posted in "Pending" status. After receiving 1 approval vote, it will be marked as "Verified" and you'll receive 100 ITIL tokens as a reward!
        </p>
        <p>
          <strong>⚠️ Security:</strong> Duplicate threat indicators cannot be submitted to prevent ledger pollution.
        </p>
      </div>
    </form>
  );
}

export default IoCSubmissionForm;

import React, { useState } from 'react';
import { submitIoC } from '../utils';
import './IoCSubmissionForm.css';

function IoCSubmissionForm({ userAccount, onSuccess, onError, onLoading }) {
  const [threatIndicator, setThreatIndicator] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!threatIndicator.trim()) {
      onError('Please enter a threat indicator');
      return;
    }

    setIsSubmitting(true);
    onLoading(true);

    try {
      await submitIoC(threatIndicator);
      onSuccess(`✓ Threat indicator "${threatIndicator}" submitted successfully!`);
      setThreatIndicator('');
    } catch (err) {
      console.error('Submission error:', err);
      const errorMsg = err.reason || err.message || 'Failed to submit threat indicator';
      onError(`✗ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="threatIndicator">
          Threat Indicator
          <span className="required">*</span>
        </label>
        <input
          id="threatIndicator"
          type="text"
          placeholder="e.g., 192.168.1.100, malware_hash_a1b2c3..., suspicious-domain.com"
          value={threatIndicator}
          onChange={(e) => setThreatIndicator(e.target.value)}
          disabled={isSubmitting}
          maxLength="256"
        />
        <p className="helper-text">
          Submit an IP address, malware hash, domain, or any other threat indicator
        </p>
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
          <strong>📌 Note:</strong> Your submission will be posted in "Pending" status. After receiving 3 approval votes, it will be marked as "Verified" and you'll receive 10 ITIL tokens as a reward!
        </p>
      </div>
    </form>
  );
}

export default IoCSubmissionForm;

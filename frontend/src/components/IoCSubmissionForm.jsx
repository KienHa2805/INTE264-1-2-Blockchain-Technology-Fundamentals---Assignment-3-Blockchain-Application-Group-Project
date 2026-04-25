import React, { useState, useEffect } from 'react';
import { submitIoC } from '../utils';
import './IoCSubmissionForm.css';

function IoCSubmissionForm({ userAccount, onSuccess, onError, onLoading }) {
  const [threatIndicator, setThreatIndicator] = useState('');
  const [category, setCategory] = useState('IP Address');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [liveValidationState, setLiveValidationState] = useState(''); // '', 'valid', or 'invalid'
  const [liveValidationMessage, setLiveValidationMessage] = useState('');

  const categoryOptions = [
    { value: 'IP Address', label: '📍 IP Address', placeholder: 'e.g., 192.168.1.1' },
    { value: 'Domain Name', label: '🌐 Domain Name', placeholder: 'e.g., malicious-site.com' },
    { value: 'Phone Number', label: '☎️ Phone Number', placeholder: 'e.g., +1-555-0123' },
    { value: 'Malware Hash', label: '🔐 Malware Hash', placeholder: 'e.g., a1b2c3d4e5f6...' },
  ];

  const currentOption = categoryOptions.find(opt => opt.value === category);

  // Regex Validation Patterns for Each Category
  const validationRules = {
    'IP Address': {
      regex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      description: 'Valid IPv4 address format (0-255.0-255.0-255.0-255)',
      examples: '192.168.1.1, 10.0.0.1, 172.16.0.1'
    },
    'Domain Name': {
      regex: /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      description: 'Valid domain format',
      examples: 'example.com, sub.domain.org, malicious-site.net'
    },
    'Phone Number': {
      regex: /^[\d\s\-\+\(\)]{7,}$/,
      description: 'Valid phone number format (7+ digits with optional +, -, spaces)',
      examples: '+1-555-0123, (555) 0123, 5550123'
    },
    'Malware Hash': {
      regex: /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/,
      description: 'Valid hash format (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars)',
      examples: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4 (MD5)'
    }
  };

  // Validate Threat Indicator Against Category Rules
  const validateThreatIndicator = (indicator, selectedCategory) => {
    if (!indicator.trim()) {
      return 'Please enter a threat indicator';
    }

    const rule = validationRules[selectedCategory];
    if (!rule) {
      return `Unknown category: ${selectedCategory}`;
    }

    if (!rule.regex.test(indicator)) {
      return `Invalid format: Please enter a valid ${selectedCategory.toLowerCase()}. ${rule.description}`;
    }

    return '';
  };

  // Clear validation error when user changes input
  useEffect(() => {
    if (validationError && threatIndicator.trim()) {
      const error = validateThreatIndicator(threatIndicator, category);
      setValidationError(error);
    }
  }, [threatIndicator, category]);

  // Live validation state checker (real-time glow effect)
  const updateLiveValidation = (indicator, selectedCategory) => {
    if (!indicator.trim()) {
      setLiveValidationState('');
      setLiveValidationMessage('');
      return;
    }

    const rule = validationRules[selectedCategory];
    if (!rule) {
      setLiveValidationState('invalid');
      setLiveValidationMessage(`Unknown category: ${selectedCategory}`);
      return;
    }

    if (rule.regex.test(indicator)) {
      setLiveValidationState('valid');
      setLiveValidationMessage('');
    } else {
      setLiveValidationState('invalid');
      // Extract a short error message based on category
      let shortMsg = '';
      if (selectedCategory === 'IP Address') {
        shortMsg = 'Invalid IPv4 format';
      } else if (selectedCategory === 'Domain Name') {
        shortMsg = 'Invalid domain format';
      } else if (selectedCategory === 'Phone Number') {
        shortMsg = 'Invalid phone format';
      } else if (selectedCategory === 'Malware Hash') {
        shortMsg = 'Invalid MD5/SHA hash format';
      }
      setLiveValidationMessage(shortMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Validate Input Against Category Rules
    const validationErrorMsg = validateThreatIndicator(threatIndicator, category);
    if (validationErrorMsg) {
      setValidationError(validationErrorMsg);
      return;
    }

    setValidationError(''); // Clear any previous validation errors
    setIsSubmitting(true);
    onLoading(true);

    // Step 2: Execute Web3 Transaction with Error Handling
    try {
      await submitIoC(threatIndicator, category);
      onSuccess(`✓ Threat indicator "${threatIndicator}" (${category}) submitted successfully!`);
      setThreatIndicator('');
      setCategory('IP Address');
    } catch (err) {
      console.error('Submission error:', err);

      // Handle specific contract/blockchain errors
      let errorMsg = 'Transaction failed or rejected by wallet';

      if (err.reason) {
        errorMsg = err.reason;
      } else if (err.message) {
        // Parse specific error messages
        if (err.message.includes('already exists')) {
          errorMsg = 'This threat indicator has already been submitted to the ledger. Duplicate submissions are not allowed.';
        } else if (err.message.includes('user rejected') || err.message.includes('User denied')) {
          errorMsg = 'Transaction rejected by wallet. Please try again.';
        } else if (err.message.includes('insufficient funds')) {
          errorMsg = 'Insufficient gas fees. Please check your wallet balance.';
        } else if (err.message.includes('network')) {
          errorMsg = 'Network error. Please check your connection and try again.';
        } else {
          errorMsg = err.message;
        }
      }

      setValidationError(`✗ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };


  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      {/* Validation Error Alert */}
      {validationError && (
        <div className="validation-error-alert">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <div className="error-message">{validationError}</div>
            {validationError.includes('Invalid format') && (
              <div className="error-helper">
                💡 {validationRules[category].description}
                <br />
                Examples: {validationRules[category].examples}
              </div>
            )}
          </div>
          <button 
            type="button" 
            className="error-close" 
            onClick={() => setValidationError('')}
            aria-label="Close error message"
          >
            ✕
          </button>
        </div>
      )}

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
          <div className="category-helper">
            {validationRules[category]?.description}
          </div>
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
            onChange={(e) => {
              setThreatIndicator(e.target.value);
              updateLiveValidation(e.target.value, category);
            }}
            disabled={isSubmitting}
            maxLength="256"
            className={`
              ${validationError && threatIndicator.trim() ? 'input-error' : ''}
              ${liveValidationState === 'valid' ? 'input-valid' : ''}
              ${liveValidationState === 'invalid' && threatIndicator.trim() ? 'input-invalid' : ''}
            `.trim()}
          />
          {liveValidationMessage && (
            <div className="input-validation-helper">
              ✗ {liveValidationMessage}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-submit"
        disabled={isSubmitting || !threatIndicator.trim()}
      >
        {isSubmitting ? '⏳ Submitting...' : '📤 Submit Threat Indicator'}
      </button>

      <div className="submission-info">
        <p>
          <strong>📌 Note:</strong> Your submission will be posted in "Pending" status. After receiving 1 approval vote, it will be marked as "Verified". You will receive 10 ITIL tokens for a successful submission, and the verifying user will receive 5 ITIL tokens.
        </p>
        <p>
          <strong>✔️ Validation:</strong> Input is validated in real-time against category format requirements before submission.
        </p>
        <p>
          <strong>⚠️ Security:</strong> Duplicate threat indicators cannot be submitted to prevent ledger pollution.
        </p>
      </div>
    </form>
  );
}

export default IoCSubmissionForm;

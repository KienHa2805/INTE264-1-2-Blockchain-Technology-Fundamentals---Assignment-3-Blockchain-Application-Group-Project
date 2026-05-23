import React, { useState } from 'react';
import './IoCCard.css';

function IoCCard({ ioc, userAccount, onApprove, onReject }) {
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ioc.threatIndicator).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleApprove = async () => {
    setIsVoting(true);
    try {
      await onApprove();
    } finally {
      setIsVoting(false);
    }
  };

  const handleReject = async () => {
    setIsVoting(true);
    try {
      await onReject();
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusBadge = () => {
    const statuses = {
      0: 'Pending',
      1: 'Verified',
      2: 'Rejected',
    };
    const statusClass = {
      0: 'pending',
      1: 'verified',
      2: 'rejected',
    };
    return (
      <span className={`status-badge status-${statusClass[ioc.status]}`}>
        {statuses[ioc.status]}
      </span>
    );
  };

  const getCategoryBadge = () => {
    const categoryTags = {
      'IP Address': 'IP',
      'Domain Name': 'Domain',
      'Phone Number': 'Phone',
      'Malware Hash': 'Hash',
    };
    const tag = categoryTags[ioc.category] || '?';
    return (
      <span className="category-badge" title={ioc.category}>
        <span className="category-tag-label">[{tag}]</span> {ioc.category}
      </span>
    );
  };

  const getVotePercentage = () => {
    const total = parseInt(ioc.approvalCount) + parseInt(ioc.rejectionCount);
    if (total === 0) return 0;
    return Math.round((parseInt(ioc.approvalCount) / total) * 100);
  };

  const formatAddress = (addr) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwner = ioc.submitter?.toLowerCase() === userAccount?.toLowerCase();
  const canVote = !ioc.hasVoted && !isOwner && ioc.status === 0;

  return (
    <div className="ioc-card">
      <div className="card-header">
        <div className="card-title">
          <span className="ioc-id">#{ioc.id}</span>
          <span className="threat-indicator">{ioc.threatIndicator}</span>
          <button
            className="copy-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
            aria-label="Copy threat indicator"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="badge-group">
          {getCategoryBadge()}
          {getStatusBadge()}
        </div>
      </div>

      <div className="card-content">
        <div className="info-row">
          <span className="label">Submitted by:</span>
          <span className="value">{formatAddress(ioc.submitter)}</span>
          {isOwner && <span className="owner-badge">You</span>}
        </div>

        <div className="info-row">
          <span className="label">Submitted at:</span>
          <span className="value">{formatDate(ioc.createdAt)}</span>
        </div>

        <div className="voting-section">
          <div className="vote-counts">
            <div className="vote-item approval">
              <span className="vote-icon vote-icon--approve">+</span>
              <span className="vote-label">Approvals</span>
              <span className="vote-number">{ioc.approvalCount}</span>
            </div>
            <div className="vote-item rejection">
              <span className="vote-icon vote-icon--reject">−</span>
              <span className="vote-label">Rejections</span>
              <span className="vote-number">{ioc.rejectionCount}</span>
            </div>
          </div>

          {getVotePercentage() > 0 && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getVotePercentage()}%` }}
              />
              <span className="progress-text">{getVotePercentage()}% Approved</span>
            </div>
          )}
        </div>

        <div className="user-actions">
          {userAccount.toLowerCase() === ioc.submitter.toLowerCase() ? (
            <button className="btn btn-disabled" disabled>
              You submitted this threat indicator - Voting Disabled
            </button>
          ) : (
            <>
              <button
                className="btn btn-approve"
                onClick={handleApprove}
                disabled={isVoting}
              >
                {isVoting ? '...' : '✓ Vote to Approve'}
              </button>
              <button
                className="btn btn-reject"
                onClick={handleReject}
                disabled={isVoting}
              >
                {isVoting ? '...' : '✗ Vote to Reject'}
              </button>
            </>
          )}
        </div>

        {ioc.hasVoted && (
          <div className="voted-message">
            ✓ You have voted on this indicator
          </div>
        )}

        {isOwner && (
          <div className="owner-message">
            You submitted this threat indicator
          </div>
        )}
      </div>
    </div>
  );
}

export default IoCCard;

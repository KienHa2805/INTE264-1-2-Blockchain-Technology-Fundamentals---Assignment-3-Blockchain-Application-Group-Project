import React, { useState } from 'react';
import './IoCCard.css';

function IoCCard({ ioc, userAccount, onApprove, onReject }) {
  const [isVoting, setIsVoting] = useState(false);

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
        </div>
        {getStatusBadge()}
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
              <span className="vote-icon">👍</span>
              <span className="vote-label">Approvals</span>
              <span className="vote-number">{ioc.approvalCount}</span>
            </div>
            <div className="vote-item rejection">
              <span className="vote-icon">👎</span>
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

        {ioc.hasVoted && (
          <div className="voted-message">
            ✓ You have voted on this indicator
          </div>
        )}

        {isOwner && (
          <div className="owner-message">
            👤 You submitted this threat indicator
          </div>
        )}
      </div>

      <div className="card-actions">
        {ioc.status === 0 && !isOwner ? (
          <>
            <button
              className="btn btn-approve"
              onClick={handleApprove}
              disabled={ioc.hasVoted || isVoting}
            >
              {isVoting ? '...' : '✓ Approve'}
            </button>
            <button
              className="btn btn-reject"
              onClick={handleReject}
              disabled={ioc.hasVoted || isVoting}
            >
              {isVoting ? '...' : '✗ Reject'}
            </button>
          </>
        ) : ioc.status === 1 ? (
          <div className="verified-banner">
            ✅ Verified and Rewarded
          </div>
        ) : ioc.status === 2 ? (
          <div className="rejected-banner">
            ❌ Rejected
          </div>
        ) : (
          <div className="no-action">
            Cannot vote on own submission
          </div>
        )}
      </div>
    </div>
  );
}

export default IoCCard;

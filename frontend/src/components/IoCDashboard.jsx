import React, { useState, useEffect } from 'react';
import {
  getPendingIoCs,
  getIoCDetails,
  voteOnIoC,
  hasUserVoted,
} from '../utils';
import { ITIL_CONFIG } from '../config';
import IoCCard from './IoCCard';
import './IoCDashboard.css';

function IoCDashboard({ userAccount, refresh, onSuccess, onError, onLoading }) {
  const [ioCs, setIoCs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingIoCs();
  }, [refresh, userAccount]);

  const fetchPendingIoCs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pendingIds = await getPendingIoCs();

      if (pendingIds.length === 0) {
        setIoCs([]);
        return;
      }

      const ioCsData = await Promise.all(
        pendingIds.map(async (id) => {
          const details = await getIoCDetails(id.toString());
          const hasVoted = await hasUserVoted(id.toString(), userAccount);
          return {
            ...details,
            hasVoted,
          };
        })
      );

      setIoCs(ioCsData);
    } catch (err) {
      console.error('Failed to fetch pending IoCs:', err);
      setError('Failed to fetch threat indicators. Please try again.');
      onError('Failed to load threat indicators');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (iocId, isApproved) => {
    onLoading(true);

    try {
      await voteOnIoC(iocId, isApproved);
      const message = isApproved
        ? `✓ You approved threat indicator #${iocId}`
        : `✗ You rejected threat indicator #${iocId}`;
      onSuccess(message);
      
      // Refresh the list
      await fetchPendingIoCs();
    } catch (err) {
      console.error('Vote error:', err);
      const errorMsg = err.reason || err.message || 'Failed to cast vote';
      onError(`✗ ${errorMsg}`);
    } finally {
      onLoading(false);
    }
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading threat indicators...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchPendingIoCs}>
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="ioc-dashboard">
      {ioCs.length === 0 ? (
        <div className="no-ioCs">
          <p>✨ No pending threat indicators at this time.</p>
          <p>Be the first to submit one above!</p>
        </div>
      ) : (
        <div className="ioCs-grid">
          <div className="stats-bar">
            <span className="stat">📊 Total Pending: {ioCs.length}</span>
            <span className="stat threshold-info">⚡ Verified with {ITIL_CONFIG.VERIFICATION_THRESHOLD} vote{ITIL_CONFIG.VERIFICATION_THRESHOLD !== 1 ? 's' : ''}</span>
          </div>
          {ioCs.map((ioc) => (
            <IoCCard
              key={ioc.id}
              ioc={ioc}
              userAccount={userAccount}
              onApprove={() => handleVote(ioc.id, true)}
              onReject={() => handleVote(ioc.id, false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default IoCDashboard;

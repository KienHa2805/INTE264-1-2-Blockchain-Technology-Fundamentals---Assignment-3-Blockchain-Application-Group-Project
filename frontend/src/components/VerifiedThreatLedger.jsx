import React, { useState, useEffect, useCallback } from 'react';
import { getVerifiedIoCs } from '../utils';
import './VerifiedThreatLedger.css';

function VerifiedThreatLedger({ refresh }) {
  const [verifiedIoCs, setVerifiedIoCs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const fetchVerifiedIoCs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const verified = await getVerifiedIoCs();
      setVerifiedIoCs(verified);
      console.log(`VerifiedThreatLedger: Loaded ${verified.length} verified IoCs`);
    } catch (err) {
      console.error('Failed to fetch verified IoCs:', err);
      setError('Failed to load verified threat intelligence');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifiedIoCs();
  }, [refresh, fetchVerifiedIoCs]);

  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp) => {
    const ts = parseInt(timestamp);
    if (ts === 0) return 'N/A';
    const date = new Date(ts * 1000);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="ledger-loading">
        {[...Array(5)].map((_, i) => (
          <div className="skeleton-row" key={i}>
            <div className="skeleton-cell" style={{ width: '40px' }} />
            <div className="skeleton-cell" style={{ width: '90px' }} />
            <div className="skeleton-cell" style={{ flex: 1 }} />
            <div className="skeleton-cell" style={{ width: '80px' }} />
            <div className="skeleton-cell" style={{ width: '60px' }} />
            <div className="skeleton-cell" style={{ width: '110px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="ledger-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchVerifiedIoCs}>
          ↻ Retry
        </button>
      </div>
    );
  }

  return (
    <div className="verified-threat-ledger">
      {verifiedIoCs.length === 0 ? (
        <div className="no-verified">
          <p>No verified threats in ledger yet.</p>
          <p>Threat indicators will appear here once verified by the community.</p>
        </div>
      ) : (
        <div className="ledger-container">
          <div className="ledger-header">
            <span className="ledger-stat">Total Verified: {verifiedIoCs.length}</span>
            <span className="ledger-stat">Community Consensus Achieved</span>
          </div>

          <div className="ledger-table-wrapper">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-category">Category</th>
                  <th className="col-threat">Threat Indicator</th>
                  <th className="col-submitter">Submitter</th>
                  <th className="col-approvals">Approvals</th>
                  <th className="col-verified">Verified</th>
                </tr>
              </thead>
              <tbody>
                {verifiedIoCs.map((ioc) => (
                  <tr key={ioc.id} className="ledger-row">
                    <td className="col-id">
                      <span className="threat-id">#{ioc.id}</span>
                    </td>
                    <td className="col-category">
                      <span className="category-tag" title={ioc.category}>
                        {ioc.category}
                      </span>
                    </td>
                    <td className="col-threat">
                      <span className="threat-indicator">{ioc.threatIndicator}</span>
                      <button
                        className="copy-btn"
                        onClick={() => handleCopy(ioc.id, ioc.threatIndicator)}
                        title="Copy to clipboard"
                      >
                        {copiedId === ioc.id ? 'Copied!' : 'Copy'}
                      </button>
                    </td>
                    <td className="col-submitter">
                      <span 
                        className="submitter-address"
                        title={ioc.submitterAddress}
                      >
                        {formatAddress(ioc.submitterAddress)}
                      </span>
                    </td>
                    <td className="col-approvals">
                      <span className="approval-badge">
                        ✓ {ioc.approvals}
                      </span>
                    </td>
                    <td className="col-verified">
                      <span className="verified-time">
                        {formatTimestamp(ioc.verifiedAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ledger-footer">
            <p className="ledger-note">
              All threats in this ledger have been verified and confirmed by community voting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifiedThreatLedger;

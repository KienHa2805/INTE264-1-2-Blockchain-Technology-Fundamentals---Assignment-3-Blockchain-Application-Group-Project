import React, { useState, useEffect } from 'react';
import './App.css';
import WalletConnect from './components/WalletConnect';
import IoCSubmissionForm from './components/IoCSubmissionForm';
import IoCDashboard from './components/IoCDashboard';
import {
  isMetaMaskInstalled,
} from './utils';

function App() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install the MetaMask extension to use this application.');
    }

    // Listen for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    // Listen for network changes
    const handleChainChanged = () => {
      window.location.reload();
    };

    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      // Cleanup listeners on unmount
      if (isMetaMaskInstalled()) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleConnectionSuccess = (connectedAccount) => {
    setAccount(connectedAccount);
    setIsConnected(true);
    setError(null);
    setSuccess('Wallet connected successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleConnectionError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const handleActionSuccess = (message) => {
    setSuccess(message);
    setRefresh((prev) => prev + 1); // Trigger data refresh
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleActionError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🔐 ITIL</h1>
          <p className="subtitle">Immutable Threat Intelligence Ledger</p>
          <p className="description">Decentralized threat intelligence on the blockchain</p>
        </div>
        <WalletConnect
          account={account}
          isConnected={isConnected}
          onConnectionSuccess={handleConnectionSuccess}
          onConnectionError={handleConnectionError}
        />
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {loading && <div className="loading-spinner">Processing transaction...</div>}

      <main className="app-main">
        {isConnected ? (
          <div className="container">
            <section className="section">
              <h2>Submit Threat Indicator</h2>
              <p className="section-description">Report a suspect IP, malware hash, or domain</p>
              <IoCSubmissionForm
                userAccount={account}
                onSuccess={(msg) => handleActionSuccess(msg)}
                onError={(msg) => handleActionError(msg)}
                onLoading={handleLoading}
              />
            </section>

            <section className="section">
              <h2>Pending Threat Indicators</h2>
              <p className="section-description">Vote on threats reported by the community</p>
              <IoCDashboard
                userAccount={account}
                refresh={refresh}
                onSuccess={(msg) => handleActionSuccess(msg)}
                onError={(msg) => handleActionError(msg)}
                onLoading={handleLoading}
              />
            </section>
          </div>
        ) : (
          <div className="container connect-prompt">
            <div className="message-box">
              <h2>👋 Welcome to ITIL</h2>
              <p>Connect your MetaMask wallet to get started.</p>
              <p>You'll be able to submit threats, vote on indicators, and earn ITIL tokens.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          🌐 Network: Sepolia Testnet | 📋 Contract-based threat intelligence |
          ⚠️ Use only for legitimate security research
        </p>
      </footer>
    </div>
  );
}

export default App;

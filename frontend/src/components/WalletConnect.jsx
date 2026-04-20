import React, { useState, useEffect } from 'react';
import {
  connectWallet,
  getConnectedAccount,
  switchToSepolia,
  getUserNetwork,
} from '../utils';
import './WalletConnect.css';

function WalletConnect({ account, isConnected, onConnectionSuccess, onConnectionError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (isConnected) {
      fetchNetwork();
    }
  }, [isConnected]);

  const fetchNetwork = async () => {
    try {
      const networkInfo = await getUserNetwork();
      setNetwork(networkInfo);
    } catch (err) {
      console.error('Failed to fetch network:', err);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // First, try to switch to Sepolia
      await switchToSepolia();
      // Then connect wallet
      const connectedAccount = await connectWallet();
      onConnectionSuccess(connectedAccount);
    } catch (err) {
      onConnectionError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    // MetaMask doesn't provide a disconnect method, but we can clear local state
    console.log('Disconnection handled at parent level');
  };

  const formatAddress = (addr) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
  };

  return (
    <div className="wallet-connect">
      {isConnected && account ? (
        <div className="wallet-info">
          <div className="network-badge">
            🌐 {network?.name || 'Sepolia'}
          </div>
          <div className="account-badge">
            ✓ {formatAddress(account)}
          </div>
          <button className="btn btn-secondary" disabled>
            Connected
          </button>
        </div>
      ) : (
        <button
          className="btn btn-primary"
          onClick={handleConnect}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      )}
    </div>
  );
}

export default WalletConnect;

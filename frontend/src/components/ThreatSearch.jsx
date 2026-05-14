import React, { useState } from 'react';
import { getIoCCount, getIoCDetails } from '../utils';
import './ThreatSearch.css';

const CATEGORY_RULES = [
  {
    name: "IP Address",
    regex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  },
  {
    name: "Malware Hash",
    regex: /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$|^[a-fA-F0-9]{128}$/
  },
  {
    name: "Domain Name / URL",
    regex: /^(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9][a-z0-9-]*[a-z0-9](?:\/.*)?$/i
  },
  {
    name: "Phone Number",
    regex: /^[\d\s\-\+\(\)]{7,}$/
  }
];

function ThreatSearch({ refresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [detectedCategory, setDetectedCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const detectCategory = (input) => {
    if (!input) return '';
    for (let rule of CATEGORY_RULES) {
      if (rule.regex.test(input)) {
        return rule.name;
      }
    }
    return 'Unknown Format (Free Text)';
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setDetectedCategory(detectCategory(val));
    setSearchResult(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);

    try {
      const countStr = await getIoCCount();
      const totalCount = parseInt(countStr);
      let foundIoC = null;

      // Search all IoCs locally on frontend
      for (let i = 0; i < totalCount; i++) {
        const details = await getIoCDetails(i.toString());
        if (details.threatIndicator.toLowerCase() === searchQuery.trim().toLowerCase()) {
          foundIoC = details;
          break; // Stop at first match
        }
      }

      if (foundIoC) {
        setSearchResult(foundIoC);
      } else {
        setSearchResult({ notFound: true });
      }

    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="threat-search-card">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input 
            type="text" 
            placeholder="Enter IP, Domain, Hash, or Phone..." 
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary search-btn" disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
        {searchQuery && (
          <div className="detected-category">
            Auto-Detected: <span className="badge category-badge">{detectedCategory}</span>
          </div>
        )}
      </form>

      {searchResult && !searchResult.notFound && (
        <div className={`search-result-box ${Number(searchResult.status) === 1 ? 'verified-match' : Number(searchResult.status) === 0 ? 'pending-match' : 'rejected-match'}`}>
          <div className="result-header">
            <h3>
              {Number(searchResult.status) === 1 ? '✅ Verified Threat Found' : 
               Number(searchResult.status) === 0 ? '⏳ Threat Pending Verification' : 
               '❌ Rejected Threat Found'}
            </h3>
          </div>
          <div className="result-details">
            <p><strong>Indicator:</strong> {searchResult.threatIndicator}</p>
            <p><strong>Category:</strong> {searchResult.category}</p>
            <p><strong>Submitter:</strong> {searchResult.submitter.substring(0,6)}...{searchResult.submitter.substring(searchResult.submitter.length-4)}</p>
            <p><strong>Approvals:</strong> {searchResult.approvalCount}</p>
          </div>
        </div>
      )}

      {searchResult && searchResult.notFound && (
        <div className="search-result-box no-match">
          <p>No records found. This indicator is not in the ITIL database.</p>
        </div>
      )}
    </div>
  );
}

export default ThreatSearch;
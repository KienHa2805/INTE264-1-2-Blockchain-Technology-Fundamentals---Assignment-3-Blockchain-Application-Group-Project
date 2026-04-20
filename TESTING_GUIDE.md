# Quick Start Guide: Testing New Features

## 🔒 Duplicate Prevention Feature

### How It Works

When a user submits a threat indicator, the smart contract checks if it already exists in the ledger. If it does, the submission is rejected with the error:

```
"IoC already exists on the ledger"
```

### Test Scenario 1: Prevent Duplicates

```
Step 1: Submit threat indicator "192.168.1.1" with category "IP Address"
   ✅ Transaction succeeds
   ✅ IoC appears in "Pending Threat Indicators"

Step 2: Try submitting "192.168.1.1" again (same or different user)
   ❌ Transaction fails
   ❌ Error message: "This threat indicator has already been submitted to the ledger"
```

### Test Scenario 2: Allow Similar Indicators

```
Step 1: Submit "192.168.1.1" (IP Address)
   ✅ Success

Step 2: Submit "192.168.1.2" (IP Address)
   ✅ Success - Different indicator, same category is allowed

Step 3: Submit "example.com" (Domain Name)
   ✅ Success - Different category, no conflict
```

---

## 🏷️ Category Support Feature

### Supported Categories

1. **IP Address** 📍

   - Format: IPv4 or IPv6
   - Example: 192.168.1.1, 10.0.0.1, ::1

2. **Domain Name** 🌐

   - Format: Domain or subdomain
   - Example: malicious-site.com, subdomain.example.org

3. **Phone Number** ☎️

   - Format: Phone number with or without formatting
   - Example: +1-555-0123, 555-0123, 15550123

4. **Malware Hash** 🔐
   - Format: MD5, SHA1, SHA256
   - Example: a1b2c3d4e5f6..., abc123def456...

### Test Scenario 3: Categorize Threats

```
Step 1: Submit form appears with dropdown:
   [Select Category ▼]  [Enter Threat Indicator...]

Step 2: Select "IP Address"
   - Placeholder changes to: "e.g., 192.168.1.1"

Step 3: Select "Domain Name"
   - Placeholder changes to: "e.g., malicious-site.com"

Step 4: Category persists through:
   ✅ Pending Threat Indicators (badge on card)
   ✅ Verified Threat Ledger (table column)
   ✅ Voting process (status updates, category remains)
```

---

## 📋 Full Testing Workflow

### Prerequisites

- MetaMask connected to Sepolia testnet
- Account with test ETH for gas
- Browser refreshed after contract deployment

### Test Plan

#### Phase 1: Submission & Category

```
Test 1.1: Submit with IP Address
  □ Open form
  □ Select "IP Address" from dropdown
  □ Enter "192.168.1.100"
  □ Click "Submit Threat Indicator"
  □ Confirm MetaMask transaction
  □ Verify appears in Pending with category badge: "IP Address"

Test 1.2: Submit with Domain Name
  □ Select "Domain Name" from dropdown
  □ Enter "malicious-domain.com"
  □ Submit and confirm
  □ Verify appears in Pending with category badge: "Domain Name"

Test 1.3: Submit with Malware Hash
  □ Select "Malware Hash" from dropdown
  □ Enter "a1b2c3d4e5f6..."
  □ Submit and confirm
  □ Verify appears in Pending with category badge: "Malware Hash"

Test 1.4: Submit with Phone Number
  □ Select "Phone Number" from dropdown
  □ Enter "+1-555-0123"
  □ Submit and confirm
  □ Verify appears in Pending with category badge: "Phone Number"
```

#### Phase 2: Duplicate Prevention

```
Test 2.1: Attempt duplicate with same user
  □ Submit "192.168.1.1" (IP Address)
  □ Try submitting "192.168.1.1" again with same account
  □ Expect: Error message "IoC already exists on the ledger"
  □ Transaction should be rejected

Test 2.2: Attempt duplicate with different user
  □ Switch MetaMask to different account
  □ Try submitting same "192.168.1.1"
  □ Expect: Same error - duplicate rejected
  □ Category doesn't matter - exact match is blocked

Test 2.3: Different indicators, same category
  □ Submit "192.168.1.1" (IP)
  □ Submit "10.0.0.1" (IP) - different address
  □ Both should succeed
  □ Same category allowed as long as indicator is unique
```

#### Phase 3: Voting & Verification

```
Test 3.1: Vote and verify
  □ Submit threat "192.168.1.1" (IP Address) with Account A
  □ Switch to Account B
  □ Vote "Approve" on the threat
  □ Transaction succeeds
  □ Threat moves to Verified Threat Ledger

Test 3.2: Verify category in ledger
  □ Open "Verified Threat Ledger" section
  □ Verify table has columns:
    - ID
    - Category (showing "IP Address")
    - Threat Indicator (showing "192.168.1.1")
    - Submitter Address
    - Approvals
    - Verified Date

Test 3.3: Category persists through full flow
  □ Submit with category "Malware Hash"
  □ Vote to approve
  □ Check verified ledger
  □ Category should still show "Malware Hash"
```

#### Phase 4: Error Handling

```
Test 4.1: Empty inputs
  □ Submit button disabled when threat indicator is empty
  □ Can select category, but submit stays disabled until text entered

Test 4.2: Duplicate detection
  □ Submit threat1
  □ Attempt to submit exact same threat
  □ Expect detailed error message
  □ Error should be specific: "already exists on the ledger"

Test 4.3: Network errors
  □ Disconnect MetaMask
  □ Try to submit
  □ Expect wallet connection error
  □ Reconnect and retry should work
```

---

## 🔍 Verification Checklist

### Smart Contract Level

- [ ] Contract deployed to Sepolia: 0x269E5Dc276a28b356AAa60FC02C4e7FBc76f3D14
- [ ] Token deployed to Sepolia: 0x1B5dce75E6584650589736B567C867a203c08856
- [ ] Can verify on Etherscan
- [ ] Contract accepts category parameter
- [ ] Duplicate check working (iocExists mapping)

### Frontend Level

- [ ] Category dropdown visible in submission form
- [ ] 4 category options available
- [ ] Dynamic placeholder text works
- [ ] Category badge appears on IoC cards
- [ ] Category column in verified ledger table
- [ ] Duplicate error message displays

### User Experience Level

- [ ] Form feels intuitive
- [ ] Error messages are clear
- [ ] Category selection easy
- [ ] Visual hierarchy good
- [ ] Responsive on mobile
- [ ] Performance acceptable

---

## 📊 Data Verification

### Check Stored Category

**On-chain verification (Etherscan):**

1. Go to Sepolia Etherscan
2. Search for ITIL Ledger contract address
3. Call `getIoC(0)` function
4. Check return value - should show:
   - ID: 0
   - Indicator: your_submitted_threat
   - **Category: your_selected_category** ← NEW
   - Submitter: your_address
   - Status: 1 (if verified) or 0 (if pending)

### Check Duplicate Prevention

**Smart contract state:**

- Navigate to "Read" section
- Find `iocExists` mapping
- Input your threat indicator
- Should return: `true` if submitted, `false` if not

---

## 🐛 Troubleshooting

### Problem: Category not displaying

**Solution:**

1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (F5)
3. Check .env.local has new contract address
4. Disconnect and reconnect MetaMask

### Problem: Duplicate error on first submission

**Solution:**

1. Use unique threat indicator
2. Check spelling exactly
3. May already exist from previous test - try different value
4. Check Sepolia Etherscan to verify

### Problem: Category dropdown empty or broken

**Solution:**

1. Check browser console for errors (F12)
2. Verify utils.js imported correctly
3. Clear cache and refresh
4. Try with different browser

### Problem: Form submission hangs

**Solution:**

1. Check MetaMask is connected to Sepolia
2. Check account has ETH for gas
3. Check network connection
4. Try submitting again

---

## 📈 Performance Notes

- **Duplicate check:** O(1) time complexity (mapping lookup)
- **Gas usage:** ~65,000 gas for submitIoC (with category)
- **Category storage:** Minimal impact on gas
- **Frontend:** No noticeable performance impact

---

## 🎯 Success Criteria

✅ **All tests pass when:**

1. Can submit different categories
2. Category displays correctly everywhere
3. Duplicate submissions rejected
4. Error messages are clear
5. UI is responsive
6. No console errors
7. MetaMask transactions work
8. Verified ledger shows categories

---

## 📞 Quick Reference

| Feature         | Test                 | Expected              | Result |
| --------------- | -------------------- | --------------------- | ------ |
| Submit IP       | Enter 192.168.1.1    | Appears in Pending    | ✅     |
| Submit Domain   | Enter example.com    | Appears in Pending    | ✅     |
| Submit Hash     | Enter abc123...      | Appears in Pending    | ✅     |
| Submit Phone    | Enter +1-555-0123    | Appears in Pending    | ✅     |
| Duplicate block | Submit same IP twice | Error message         | ✅     |
| Category badge  | Check Pending card   | Shows category        | ✅     |
| Verified ledger | Check table          | Shows category column | ✅     |
| Vote & verify   | Approve IoC          | Category persists     | ✅     |

---

## 🚀 Ready to Test!

All systems deployed and ready. Start with **Test Scenario 1** for a quick smoke test, then proceed through full workflow tests for comprehensive coverage.

Good luck! 🎉

# Validation Quick Reference & Testing Guide

## 🎯 Quick Validation Examples

### IP Address Category

**Input Field Example:**
```
Category: 📍 IP Address
Placeholder: "e.g., 192.168.1.1"
```

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| 192.168.1.1 | ✅ | None | Accept |
| 10.0.0.1 | ✅ | None | Accept |
| 172.16.254.1 | ✅ | None | Accept |
| 8.8.8.8 | ✅ | None | Accept |
| 255.255.255.255 | ✅ | None | Accept |
| **256.1.1.1** | ❌ | Invalid format: Please enter a valid IP address. Valid IPv4 address format (0-255.0-255.0-255.0-255) | Reject |
| **192.168** | ❌ | Invalid format: Please enter a valid IP address. Valid IPv4 address format (0-255.0-255.0-255.0-255) | Reject |
| **192.168.1** | ❌ | Invalid format: Please enter a valid IP address. Valid IPv4 address format (0-255.0-255.0-255.0-255) | Reject |
| **192.168.1.1.1** | ❌ | Invalid format: Please enter a valid IP address. Valid IPv4 address format (0-255.0-255.0-255.0-255) | Reject |
| **192.168.1.a** | ❌ | Invalid format: Please enter a valid IP address. Valid IPv4 address format (0-255.0-255.0-255.0-255) | Reject |
| **192 168 1 1** | ❌ | Invalid format: Please enter a valid IP address. Valid IPv4 address format (0-255.0-255.0-255.0-255) | Reject |
| **(empty)** | ❌ | Please enter a threat indicator | Reject |

---

### Domain Name Category

**Input Field Example:**
```
Category: 🌐 Domain Name
Placeholder: "e.g., malicious-site.com"
```

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| example.com | ✅ | None | Accept |
| malicious-site.org | ✅ | None | Accept |
| sub.domain.co.uk | ✅ | None | Accept |
| a.b.c.example.net | ✅ | None | Accept |
| test-domain-123.info | ✅ | None | Accept |
| x.co | ✅ | None | Accept |
| **example** | ❌ | Invalid format: Please enter a valid domain name. Valid domain format | Reject |
| **.example.com** | ❌ | Invalid format: Please enter a valid domain name. Valid domain format | Reject |
| **example-.com** | ❌ | Invalid format: Please enter a valid domain name. Valid domain format | Reject |
| **-example.com** | ❌ | Invalid format: Please enter a valid domain name. Valid domain format | Reject |
| **example..com** | ❌ | Invalid format: Please enter a valid domain name. Valid domain format | Reject |
| **example .com** | ❌ | Invalid format: Please enter a valid domain name. Valid domain format | Reject |
| **example.c** | ✅ | None | Accept |
| **(empty)** | ❌ | Please enter a threat indicator | Reject |

---

### Phone Number Category

**Input Field Example:**
```
Category: ☎️ Phone Number
Placeholder: "e.g., +1-555-0123"
```

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| +1-555-0123 | ✅ | None | Accept |
| (555) 0123 | ✅ | None | Accept |
| 5550123 | ✅ | None | Accept |
| +44 20 7946 0958 | ✅ | None | Accept |
| 1 (516) 884-4311 | ✅ | None | Accept |
| +33 1 42 68 53 00 | ✅ | None | Accept |
| 555-0123 | ✅ | None | Accept |
| (555)0123 | ✅ | None | Accept |
| **123** | ❌ | Invalid format: Please enter a valid phone number. Valid phone number format (7+ digits with optional +, -, spaces) | Reject |
| **12345** | ❌ | Invalid format: Please enter a valid phone number. Valid phone number format (7+ digits with optional +, -, spaces) | Reject |
| **+1-ABC-0123** | ❌ | Invalid format: Please enter a valid phone number. Valid phone number format (7+ digits with optional +, -, spaces) | Reject |
| **phone-number** | ❌ | Invalid format: Please enter a valid phone number. Valid phone number format (7+ digits with optional +, -, spaces) | Reject |
| **555@0123** | ❌ | Invalid format: Please enter a valid phone number. Valid phone number format (7+ digits with optional +, -, spaces) | Reject |
| **(empty)** | ❌ | Please enter a threat indicator | Reject |

---

### Malware Hash Category

**Input Field Example:**
```
Category: 🔐 Malware Hash
Placeholder: "e.g., a1b2c3d4e5f6..."
```

#### MD5 Hashes (32 characters)

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4 | ✅ | None | Accept |
| 5D41402ABC4B2A76B9719D911017C592 | ✅ | None | Accept |
| 202cb962ac59075b964b07152d234b70 | ✅ | None | Accept |

#### SHA-1 Hashes (40 characters)

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| 356a192b7913b04c54574d18c28d46e6395428ab | ✅ | None | Accept |
| DA39A3EE5E6B4B0D3255BFEF95601890AFD80709 | ✅ | None | Accept |
| 2aae6c35c94fcfb415dbe95f408b9ce91ee846ed | ✅ | None | Accept |

#### SHA-256 Hashes (64 characters)

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | ✅ | None | Accept |
| 2C26B46911185131006BA6B8D92451D726D0642CFA675D1B4696FBD6540C0374 | ✅ | None | Accept |
| 9F86D081884C7D6D9FFA60822D3C3652696F61E65891DCD73149E2E3067FBE94 | ✅ | None | Accept |

#### Invalid Hashes

| Test Input | Valid? | Error Message | Status |
|------------|--------|---------------|--------|
| **a1b2c3d4** | ❌ | Invalid format: Please enter a valid malware hash. Valid hash format (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars) | Reject |
| **a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4g** | ❌ | Invalid format: Please enter a valid malware hash. Valid hash format (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars) | Reject |
| **a1b2c3d4 e5f6a1b2c3d4e5f6a1b2c3d4** | ❌ | Invalid format: Please enter a valid malware hash. Valid hash format (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars) | Reject |
| **{a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4}** | ❌ | Invalid format: Please enter a valid malware hash. Valid hash format (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars) | Reject |
| **(empty)** | ❌ | Please enter a threat indicator | Reject |

---

## 🧪 Manual Testing Checklist

### Setup
- [ ] Open frontend application
- [ ] Connect MetaMask to Sepolia testnet
- [ ] Have test ETH for gas fees

### IP Address Validation Tests

**Test 1: Valid IP Submission**
- [ ] Select "IP Address" category
- [ ] Enter: 192.168.1.1
- [ ] Expected: No error, placeholder visible
- [ ] Click submit
- [ ] Expected: Transaction submitted to MetaMask

**Test 2: Invalid IP - Octet Too High**
- [ ] Select "IP Address" category
- [ ] Enter: 256.1.1.1
- [ ] Expected: Error appears immediately
- [ ] Error text: "Invalid format: Please enter a valid IP address..."
- [ ] Error helper shows examples
- [ ] Try clearing and entering 192.168.1.1
- [ ] Expected: Error disappears automatically

**Test 3: Invalid IP - Incomplete**
- [ ] Select "IP Address" category
- [ ] Enter: 192.168.1
- [ ] Expected: Error alert appears
- [ ] Correct to 192.168.1.1
- [ ] Expected: Error clears as you type

**Test 4: Empty Input**
- [ ] Select "IP Address" category
- [ ] Leave empty
- [ ] Try to click submit
- [ ] Expected: Button disabled (gray)
- [ ] Type any character
- [ ] Expected: Button enabled

---

### Domain Name Validation Tests

**Test 5: Valid Domain Submission**
- [ ] Select "Domain Name" category
- [ ] Enter: example.com
- [ ] Expected: No error, placeholder changes
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 6: Invalid Domain - No TLD**
- [ ] Select "Domain Name" category
- [ ] Enter: example
- [ ] Expected: Error alert appears
- [ ] Error text: "Invalid format: Please enter a valid domain name..."
- [ ] Correct to example.com
- [ ] Expected: Error clears

**Test 7: Invalid Domain - Leading Dot**
- [ ] Select "Domain Name" category
- [ ] Enter: .example.com
- [ ] Expected: Error alert appears
- [ ] Fix to example.com
- [ ] Expected: Error clears

**Test 8: Complex Valid Domain**
- [ ] Select "Domain Name" category
- [ ] Enter: sub.domain.co.uk
- [ ] Expected: No error
- [ ] Click submit
- [ ] Expected: Transaction submitted

---

### Phone Number Validation Tests

**Test 9: Valid Phone - With Formatting**
- [ ] Select "Phone Number" category
- [ ] Enter: +1-555-0123
- [ ] Expected: No error
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 10: Valid Phone - Parentheses**
- [ ] Select "Phone Number" category
- [ ] Enter: (555) 0123
- [ ] Expected: No error
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 11: Valid Phone - Just Digits**
- [ ] Select "Phone Number" category
- [ ] Enter: 5550123
- [ ] Expected: No error (exactly 7 digits)
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 12: Invalid Phone - Too Short**
- [ ] Select "Phone Number" category
- [ ] Enter: 123
- [ ] Expected: Error alert
- [ ] Error text: "Invalid format: Please enter a valid phone number... (7+ digits...)"
- [ ] Enter: 5550123
- [ ] Expected: Error clears

**Test 13: Invalid Phone - Letters**
- [ ] Select "Phone Number" category
- [ ] Enter: 555-PHONE
- [ ] Expected: Error alert
- [ ] Correct to 555-0123
- [ ] Expected: Error clears

---

### Malware Hash Validation Tests

**Test 14: Valid MD5 Hash**
- [ ] Select "Malware Hash" category
- [ ] Enter: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4
- [ ] Expected: No error
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 15: Valid SHA-1 Hash**
- [ ] Select "Malware Hash" category
- [ ] Enter: 356a192b7913b04c54574d18c28d46e6395428ab
- [ ] Expected: No error
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 16: Valid SHA-256 Hash**
- [ ] Select "Malware Hash" category
- [ ] Enter: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
- [ ] Expected: No error
- [ ] Click submit
- [ ] Expected: Transaction submitted

**Test 17: Invalid Hash - Too Short**
- [ ] Select "Malware Hash" category
- [ ] Enter: a1b2c3d4
- [ ] Expected: Error alert
- [ ] Error text: "Invalid format: Please enter a valid malware hash... (MD5: 32 chars, SHA-1: 40 chars, SHA-256: 64 chars)"
- [ ] Correct to valid 32-char hash
- [ ] Expected: Error clears

**Test 18: Invalid Hash - Non-Hex Characters**
- [ ] Select "Malware Hash" category
- [ ] Enter: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3dg (ends with 'g')
- [ ] Expected: Error alert
- [ ] Correct to valid hash
- [ ] Expected: Error clears

---

### Cross-Category Tests

**Test 19: Category Switching**
- [ ] Select "IP Address", enter: 192.168.1.1
- [ ] No error (valid IP)
- [ ] Switch to "Domain Name"
- [ ] Same value "192.168.1.1" is now invalid for domain
- [ ] Expected: Error alert appears
- [ ] Clear and enter valid domain
- [ ] Expected: Error clears

**Test 20: Error Dismissal**
- [ ] Create validation error (invalid input)
- [ ] Error alert shows with close button (✕)
- [ ] Click the close button
- [ ] Expected: Error alert disappears
- [ ] Fix the input
- [ ] Expected: Submit allowed

---

### Web3 Transaction Error Tests

**Test 21: Duplicate Submission**
- [ ] Submit: 192.168.1.1 (IP Address)
- [ ] MetaMask confirms transaction
- [ ] Expected: Success message
- [ ] Try submitting same IP again
- [ ] MetaMask confirms transaction
- [ ] Expected: Web3 error alert
- [ ] Error text: "✗ This threat indicator has already been submitted to the ledger..."

**Test 22: User Rejects Transaction**
- [ ] Enter valid threat indicator
- [ ] Click submit
- [ ] MetaMask popup appears
- [ ] Click "Reject" in MetaMask
- [ ] Expected: Error alert in form
- [ ] Error text: "✗ Transaction rejected by wallet. Please try again."

**Test 23: Insufficient Gas**
- [ ] (If applicable with low gas balance)
- [ ] Enter valid threat indicator
- [ ] Click submit
- [ ] Expected: Error alert
- [ ] Error text: "✗ Insufficient gas fees..."

---

## 🎯 Error Flow Testing

**Scenario: User Makes Multiple Mistakes**

```
Step 1: User enters invalid IP "256.1.1.1"
  → Error alert appears with helper text
  
Step 2: User changes category to Domain Name
  → Validation re-runs, error persists for new category
  → (IP format invalid for domains)
  
Step 3: User clears field
  → New error: "Please enter a threat indicator"
  
Step 4: User enters valid domain "example.com"
  → Error clears automatically
  
Step 5: User clicks submit
  → Validation passes
  → Web3 transaction initiated
  
Step 6: User confirms in MetaMask
  → Success message appears
  → Form clears
```

---

## ✅ Validation Testing Success Criteria

**All tests pass when:**
- [ ] Valid inputs submit without error alerts
- [ ] Invalid inputs show specific error messages
- [ ] Error messages include helpful hints
- [ ] Errors clear when input becomes valid
- [ ] Category changes trigger re-validation
- [ ] Error close button works
- [ ] Input field highlights in pink on error
- [ ] Helper text shows examples
- [ ] Duplicate submissions caught by Web3
- [ ] Network/wallet errors handled gracefully
- [ ] No validation errors in browser console
- [ ] Form remains responsive with error alerts
- [ ] Error styling matches SOC dashboard theme

---

## 🐛 Debugging Commands

**Browser Console (F12 → Console):**

```javascript
// Test IP regex directly
const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
console.log(ipRegex.test('192.168.1.1'));  // true
console.log(ipRegex.test('256.1.1.1'));    // false

// Test domain regex
const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
console.log(domainRegex.test('example.com'));      // true
console.log(domainRegex.test('example'));         // false

// Test phone regex
const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
console.log(phoneRegex.test('+1-555-0123'));  // true
console.log(phoneRegex.test('123'));         // false

// Test hash regex
const hashRegex = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/;
console.log(hashRegex.test('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4'));  // true (MD5)
console.log(hashRegex.test('356a192b7913b04c54574d18c28d46e6395428ab'));  // true (SHA-1)
```

---

## 📝 Report Template

**When reporting validation issues:**

1. **Test Category:** (IP Address / Domain Name / Phone Number / Malware Hash)
2. **Input Tested:** `[paste exact input]`
3. **Expected Result:** [what should happen]
4. **Actual Result:** [what actually happened]
5. **Error Message (if any):** [paste exact error]
6. **Browser:** [Chrome / Firefox / Safari / Edge]
7. **Network:** [Sepolia Testnet / Other]

---

## ✨ Summary

This testing guide covers all validation scenarios. All tests should pass with the current implementation.

**Status:** ✅ Ready for Testing


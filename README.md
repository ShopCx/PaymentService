# ShopCx Payment Service

A Node.js-based payment processing service for the ShopCx demo application with intentionally vulnerable endpoints.

## Vulnerabilities

### 1. Command Injection
- **Location**: `server.js`
- **Description**: Unsafe command execution with user input
- **Test Example**: 
  ```javascript
  amount: "100; rm -rf /"
  ```

### 2. JWT Vulnerabilities
- **Location**: `server.js`
- **Description**: Weak algorithm (HS256) and insecure verification
- **Test Example**: 
  ```javascript
  jwt.sign({ admin: true }, 'very_secret_key_123', { algorithm: 'HS256' })
  ```

### 3. Lodash Prototype Pollution (v4.17.4)
- **Location**: `utils/lodash-example.js`
- **Vulnerable Methods**:
  - `_.merge()`
  - `_.set()`
  - `_.defaultsDeep()`
  - `_.extend()`
  - `_.assign()`
  - `_.isString()`
- **Test Examples**:
  ```javascript
  // Prototype pollution payload
  const maliciousPayload = {
      "__proto__": {
          "isAdmin": true,
          "toString": function() { return "string"; },
          "valueOf": function() { return "string"; }
      }
  };

  // Exploit merge
  mergePaymentData({}, maliciousPayload);

  // Exploit set
  setPaymentProperty({}, "__proto__.isAdmin", true);

  // Exploit defaultsDeep
  setDefaultPaymentSettings({}, maliciousPayload);

  // Exploit extend
  extendPaymentProfile({}, maliciousPayload);

  // Exploit assign
  assignPaymentRoles({}, maliciousPayload);

  // Bypass type checking
  validatePaymentInput({});  // Will pass if prototype is polluted
  validatePaymentObject({}); // Will pass if prototype is polluted
  processPaymentData({});    // Will pass if prototype is polluted
  ```

### 4. Race Conditions
- **Location**: `server.js`
- **Description**: Unsafe transaction status updates
- **Test Example**: Concurrent refund requests

### 5. Information Disclosure
- **Location**: `server.js`
- **Description**: Detailed error messages and stack traces
- **Test Example**: Invalid input to any endpoint

## Setup

1. Install Node.js 12 or later
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service:
   ```bash
   npm start
   ```

## API Documentation

API documentation is available at `/swagger/index.html` when the service is running.

## Dependencies

- express: 4.17.1
- mongoose: 5.9.15
- redis: 2.8.0
- jsonwebtoken: 8.5.1
- lodash: 4.17.4 (intentionally vulnerable)
- swagger-ui-express: 4.1.3

## Security Best Practices (What NOT to do)

1. Using `exec()` with user input
2. Using weak JWT algorithms
3. Using outdated Lodash version
4. Having no transaction locking
5. Exposing detailed error messages
6. No input validation
7. No proper authentication
8. No rate limiting
9. No proper error handling
10. No security headers 
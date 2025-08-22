# ShopCx Payment Service

A Node.js-based payment processing service for the ShopCx demo application with intentionally vulnerable endpoints. This service handles payment processing, transaction management, refunds, and provides comprehensive payment analytics for the e-commerce platform.

## Overview

The Payment Service is a Node.js Express application that provides secure payment processing capabilities including transaction management, refund processing, and payment validation. It integrates with MongoDB for transaction storage and Redis for caching, featuring comprehensive logging and monitoring.

## Key Features

- **Payment Processing**: Secure credit card transaction processing
- **Transaction Management**: Complete transaction lifecycle management
- **Refund Processing**: Automated refund handling and tracking
- **MongoDB Integration**: Persistent transaction and refund storage
- **Redis Caching**: Fast session and data caching
- **JWT Authentication**: Token-based payment verification
- **Input Validation**: Comprehensive request validation middleware
- **Health Monitoring**: Service health checks and dependency monitoring
- **Metrics Collection**: Prometheus-compatible metrics endpoint
- **Structured Logging**: JSON-formatted logging with Winston

## Technology Stack

- **Node.js 16**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Transaction and refund data storage
- **Mongoose**: MongoDB object modeling
- **Redis**: Caching and session storage
- **JWT**: Token-based authentication
- **Winston**: Structured logging
- **Lodash**: Utility functions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/process` | Process payment transaction |
| GET | `/api/payments/verify/{token}` | Verify payment token |
| POST | `/api/payments/refund` | Process refund request |
| POST | `/api/payments/validate` | Validate payment data |
| POST | `/api/admin/transactions/clear` | Clear all transactions (admin) |
| GET | `/health` | Service health check |
| GET | `/metrics` | Prometheus metrics |

## Dependencies

### Required Services
- **MongoDB**: Required for transaction and refund storage
  - Default URI: `mongodb://admin:admin123@localhost:27017/shopcx`
- **Redis**: Required for caching and session storage
  - Default URL: `redis://localhost:6379`

### Node.js Dependencies
See `package.json` and `package-lock.json` for full dependency list.

## Build & Run

### Prerequisites
- Node.js 16 or higher
- MongoDB server running locally
- Redis server running locally

### Local Development
```bash
# Install dependencies
npm install

# Set environment variables
export MONGODB_URI="mongodb://admin:admin123@localhost:27017/shopcx"
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="your-secret-key"

# Run the service
npm start
```

The service will start on `http://localhost:3000`.

### Docker
```bash
# Build Docker image
docker build -t shopcx-payment-service .

# Run container
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb://admin:admin123@mongodb:27017/shopcx" \
  -e REDIS_URL="redis://redis:6379" \
  shopcx-payment-service
```

## Configuration

### Environment Variables
- `PORT`: Service port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: JWT signing secret
- `NODE_ENV`: Application environment (development/production)

### Database Schema

The service uses MongoDB with the following collections:

#### Transactions Collection
```javascript
{
  transactionId: String,    // Unique transaction identifier
  amount: Number,          // Payment amount
  currency: String,        // Currency code (USD, EUR, GBP)
  cardNumber: String,      // Credit card number
  cvv: String,            // Card verification value
  status: String,         // pending, completed, failed, refunded
  userId: String,         // Associated user ID
  metadata: Object,       // Additional transaction data
  createdAt: Date,        // Transaction creation time
  processedAt: Date       // Processing completion time
}
```

#### Refunds Collection
```javascript
{
  refundId: String,       // Unique refund identifier
  transactionId: String,  // Original transaction ID
  amount: Number,         // Refund amount
  reason: String,         // Refund reason
  status: String,         // pending, completed, failed
  createdAt: Date,        // Refund creation time
  processedAt: Date       // Processing completion time
}
```

## API Usage Examples

### Process Payment
```bash
curl -X POST http://localhost:3000/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "cardNumber": "4111111111111111",
    "cvv": "123"
  }'
```

### Verify Payment Token
```bash
curl -X GET http://localhost:3000/api/payments/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Process Refund
```bash
curl -X POST http://localhost:3000/api/payments/refund \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "txn_1234567890",
    "amount": 50.00
  }'
```

## Health Check

The service provides comprehensive health monitoring:
- **Endpoint**: `/health`
- **Checks**: MongoDB connectivity, Redis connectivity, service status
- **Response**: JSON with health status and dependency information

```bash
curl http://localhost:3000/health
```

## Metrics

Prometheus-compatible metrics are available:
- **Endpoint**: `/metrics`
- **Metrics**: Request counts, payment/refund totals, error counts, uptime
- **Format**: Prometheus text format

```bash
curl http://localhost:3000/metrics
```

## Input Validation

The service includes comprehensive input validation:
- **Payment amounts**: Must be positive numbers, maximum $10,000
- **Card numbers**: Must be 13-19 digits
- **CVV codes**: Must be 3-4 digits
- **Transaction IDs**: Must be valid strings

## Error Handling

Consistent error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": "Additional error context"
  }
}
```

## Logging

Structured JSON logging includes:
- Timestamp and service identification
- Request/response details
- Transaction and refund operations
- Error tracking and stack traces
- Security events and validation failures

## Security Note

⚠️ **This is an intentionally vulnerable application for security testing purposes. Do not deploy in production environments.**

### Known Vulnerabilities (Intentional)
- Command injection in payment processing
- Insecure JWT secret management
- Missing rate limiting
- Insufficient input sanitization
- Exposed sensitive information in logs

## Recommended Checkmarx One Configuration
- Criticality: 5
- Cloud Insights: Yes
- Internet-facing: Yes

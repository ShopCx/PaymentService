# ShopCx Payment Service

A Node.js-based payment processing service for the ShopCx demo application with intentionally vulnerable endpoints. This service handles payment processing, transaction management, refunds, and provides comprehensive payment analytics for the e-commerce platform.

## Security Note

⚠️ **This is an intentionally vulnerable application for security testing purposes. Do not deploy in production or sensitive environments.**

## Overview

The Payment Service is a Node.js Express application that provides secure payment processing capabilities including transaction management, refund processing, and payment validation. It integrates with MongoDB for transaction storage and Redis for caching, featuring comprehensive logging and monitoring with intentionally vulnerable command injection patterns.

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
- **Command Execution**: Payment processing with subprocess execution
- **Payment Validation**: Input validation and verification endpoints
- **Admin Operations**: Transaction clearing and management

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Transaction and refund data storage
- **Mongoose**: MongoDB object modeling
- **Redis**: Caching and session storage
- **JWT**: Token-based authentication
- **Winston**: Structured logging
- **Lodash**: Utility functions
- **Helmet**: Security middleware
- **Morgan**: HTTP request logging
- **Swagger UI Express**: API documentation
- **Body Parser**: Request body parsing
- **CORS**: Cross-origin resource sharing
- **Moment**: Date manipulation utilities
- **Async**: Asynchronous utilities

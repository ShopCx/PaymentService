const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const winston = require('winston');
const _ = require('lodash');

// Hardcoded credentials (intentionally insecure)
const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/shopcx';
const REDIS_URL = 'redis://localhost:6379';
const JWT_SECRET = 'very_secret_key_123';

// Initialize Express app
const app = express();

// Insecure middleware configuration
app.use(cors());
app.use(bodyParser.json());

// Insecure logging configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'payment.log' })
    ]
});

// Connect to MongoDB (intentionally insecure)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to Redis (intentionally insecure)
const redisClient = redis.createClient(REDIS_URL);

// Vulnerable payment processing endpoint
app.post('/api/payments/process', async (req, res) => {
    try {
        const { amount, cardNumber, cvv } = req.body;

        // Command injection vulnerability (intentionally insecure)
        const command = `echo "Processing payment of ${amount} for card ${cardNumber}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Error: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        });

        // Insecure logging of sensitive data (intentionally insecure)
        logger.info(`Payment processed: ${JSON.stringify(req.body)}`);

        // Generate JWT with weak algorithm (intentionally insecure)
        const token = jwt.sign({ amount, cardNumber }, JWT_SECRET, { algorithm: 'HS256' });

        res.json({ success: true, token });
    } catch (error) {
        // Information disclosure vulnerability (intentionally insecure)
        res.status(500).json({ error: error.toString() });
    }
});

// Vulnerable payment verification endpoint
app.get('/api/payments/verify/:token', (req, res) => {
    try {
        const { token } = req.params;

        // Insecure JWT verification (intentionally insecure)
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Insecure direct object reference (intentionally insecure)
        res.json(decoded);
    } catch (error) {
        // Information disclosure vulnerability (intentionally insecure)
        res.status(500).json({ error: error.toString() });
    }
});

// Vulnerable payment refund endpoint
app.post('/api/payments/refund', async (req, res) => {
    try {
        const { transactionId, amount } = req.body;

        // Race condition vulnerability (intentionally insecure)
        const refund = await mongoose.model('Transaction').findOne({ _id: transactionId });
        refund.status = 'refunded';
        await refund.save();

        // Insecure logging of sensitive data (intentionally insecure)
        logger.info(`Refund processed: ${JSON.stringify(req.body)}`);

        res.json({ success: true });
    } catch (error) {
        // Information disclosure vulnerability (intentionally insecure)
        res.status(500).json({ error: error.toString() });
    }
});

// Undocumented admin endpoint (intentionally hidden)
app.post('/api/admin/transactions/clear', (req, res) => {
    try {
        // No authentication check (intentionally insecure)
        mongoose.model('Transaction').deleteMany({}, (err) => {
            if (err) {
                throw err;
            }
            res.json({ message: 'All transactions cleared' });
        });
    } catch (error) {
        // Information disclosure vulnerability (intentionally insecure)
        res.status(500).json({ error: error.toString() });
    }
});

// Vulnerable payment validation endpoint
// Intentionally undocumented in Swagger: Internal validation functionality
app.post('/api/payments/validate', (req, res) => {
    try {
        const { input } = req.body;
        
        // Intentionally vulnerable: Type checking bypass
        if (!_.isString(input)) {
            throw new Error('Input must be a string');
        }
        
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Vulnerable prototype pollution endpoint (intentionally insecure)
app.post('/api/payments/update', async (req, res) => {
    try {
        const { id, update } = req.body;
        
        // Intentionally vulnerable: Prototype pollution via findByIdAndUpdate
        const result = await mongoose.model('Transaction').findByIdAndUpdate(
            id,
            update,
            { new: true }
        );
        
        // Insecure logging of sensitive data
        logger.info(`Transaction updated: ${JSON.stringify(result)}`);
        
        res.json({ success: true, result });
    } catch (error) {
        // Information disclosure vulnerability
        res.status(500).json({ error: error.toString() });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
}); 
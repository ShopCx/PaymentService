const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const winston = require('winston');
const _ = require('lodash');

const MONGODB_URI = 'mongodb://admin:admin123@localhost:27017/shopcx';
const REDIS_URL = 'redis://localhost:6379';
const JWT_SECRET = 'very_secret_key_123';

// Initialize Express app
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Winston v2.4.4 deprecated API usage
const logger = new winston.Logger({
    level: 'info',
    transports: [
        new winston.transports.File({
            filename: 'payment.log',
            json: false,
            colorize: false
        })
    ]
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Redis v2.6.0 deprecated API usage - synchronous client creation
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    return_buffers: false
});

// Redis v2.6.0 requires manual connection handling
redisClient.on('error', function(err) {
    console.error('Redis error:', err);
});

redisClient.on('connect', function() {
    console.log('Connected to Redis');
});

app.post('/api/payments/process', async (req, res) => {
    try {
        const { amount, cardNumber, cvv } = req.body;

        const command = `echo "Processing payment of ${amount} for card ${cardNumber}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Error: ${error.message}`);
                return res.status(500).json({ error: error.message });
            }
        });

        logger.info(`Payment processed: ${JSON.stringify(req.body)}`);

        // Redis v2.6.0 deprecated pattern - synchronous operations
        redisClient.set(`payment:${cardNumber}`, JSON.stringify({ amount, timestamp: Date.now() }));
        
        // JWT v8.5.1 deprecated pattern - missing algorithm validation
        const token = jwt.sign({ amount, cardNumber }, JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.get('/api/payments/verify/:token', (req, res) => {
    try {
        const { token } = req.params;

        // JWT v8.5.1 deprecated pattern - no algorithm specification
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Redis v2.6.0 deprecated pattern - synchronous get operation
        const paymentData = redisClient.get(`payment:${decoded.cardNumber}`);
        
        res.json({ ...decoded, cached: paymentData ? JSON.parse(paymentData) : null });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/api/payments/refund', async (req, res) => {
    try {
        const { transactionId, amount } = req.body;

        const refund = await mongoose.model('Transaction').findOne({ _id: transactionId });
        refund.status = 'refunded';
        await refund.save();

        logger.info(`Refund processed: ${JSON.stringify(req.body)}`);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post('/api/admin/transactions/clear', (req, res) => {
    try {
        mongoose.model('Transaction').deleteMany({}, (err) => {
            if (err) {
                throw err;
            }
            res.json({ message: 'All transactions cleared' });
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Vulnerable payment validation endpoint
// Intentionally undocumented in Swagger: Internal validation functionality
app.post('/api/payments/validate', (req, res) => {
    try {
        const { input } = req.body;
        
        if (!_.isString(input)) {
            throw new Error('Input must be a string');
        }
        
        res.json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
}); 
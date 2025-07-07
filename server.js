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

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'payment.log' })
    ]
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const redisClient = redis.createClient(REDIS_URL);

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

        const token = jwt.sign({ amount, cardNumber }, JWT_SECRET, { algorithm: 'HS256' });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.get('/api/payments/verify/:token', (req, res) => {
    try {
        const { token } = req.params;

        const decoded = jwt.verify(token, JWT_SECRET);
        
        res.json(decoded);
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
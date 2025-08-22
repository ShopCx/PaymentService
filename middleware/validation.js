const _ = require('lodash');

// Validation middleware for payment processing
const validatePaymentRequest = (req, res, next) => {
    try {
        const { amount, cardNumber, cvv } = req.body;

        const errors = [];

        // Validate amount
        if (!amount) {
            errors.push('Amount is required');
        } else if (!_.isNumber(amount) || amount <= 0) {
            errors.push('Amount must be a positive number');
        } else if (amount > 10000) {
            errors.push('Amount cannot exceed $10,000');
        }

        // Validate card number
        if (!cardNumber) {
            errors.push('Card number is required');
        } else if (!_.isString(cardNumber) || !/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
            errors.push('Card number must be 13-19 digits');
        }

        // Validate CVV
        if (!cvv) {
            errors.push('CVV is required');
        } else if (!_.isString(cvv) || !/^\d{3,4}$/.test(cvv)) {
            errors.push('CVV must be 3-4 digits');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid payment request',
                    details: errors
                }
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Internal server error',
                details: 'Validation failed'
            }
        });
    }
};

// Validation middleware for refund requests
const validateRefundRequest = (req, res, next) => {
    try {
        const { transactionId, amount } = req.body;

        const errors = [];

        // Validate transaction ID
        if (!transactionId) {
            errors.push('Transaction ID is required');
        } else if (!_.isString(transactionId)) {
            errors.push('Transaction ID must be a string');
        }

        // Validate amount
        if (!amount) {
            errors.push('Refund amount is required');
        } else if (!_.isNumber(amount) || amount <= 0) {
            errors.push('Refund amount must be a positive number');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid refund request',
                    details: errors
                }
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Internal server error',
                details: 'Validation failed'
            }
        });
    }
};

// General request body validation
const validateJsonBody = (req, res, next) => {
    try {
        if (req.method === 'POST' || req.method === 'PUT') {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    error: {
                        code: 'MISSING_BODY',
                        message: 'Request body is required',
                        details: 'No JSON body provided'
                    }
                });
            }
        }
        next();
    } catch (error) {
        res.status(400).json({
            error: {
                code: 'INVALID_JSON',
                message: 'Invalid JSON in request body',
                details: error.message
            }
        });
    }
};

module.exports = {
    validatePaymentRequest,
    validateRefundRequest,
    validateJsonBody
};

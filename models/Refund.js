const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    refundId: {
        type: String,
        required: true,
        unique: true,
        default: () => 'rfnd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },
    transactionId: {
        type: String,
        required: true,
        ref: 'Transaction'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
        type: String,
        required: false,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    requestedBy: {
        type: String,
        required: false
    },
    approvedBy: {
        type: String,
        required: false
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'refunds'
});

// Indexes
refundSchema.index({ refundId: 1 });
refundSchema.index({ transactionId: 1 });
refundSchema.index({ status: 1 });
refundSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Refund', refundSchema);

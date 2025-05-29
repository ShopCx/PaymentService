const _ = require('lodash');

// Intentionally vulnerable: Prototype pollution vulnerability in merge
function mergePaymentData(paymentData, additionalData) {
    // Vulnerable to prototype pollution
    return _.merge({}, paymentData, additionalData);
}

// Intentionally vulnerable: Prototype pollution in set
function setPaymentProperty(payment, path, value) {
    // Vulnerable to prototype pollution
    return _.set(payment, path, value);
}

// Intentionally vulnerable: Prototype pollution in defaultsDeep
function setDefaultPaymentSettings(payment, settings) {
    // Vulnerable to prototype pollution
    return _.defaultsDeep(payment, settings);
}

// Intentionally vulnerable: Prototype pollution in extend
function extendPaymentProfile(payment, profile) {
    // Vulnerable to prototype pollution
    return _.extend(payment, profile);
}

// Intentionally vulnerable: Prototype pollution in assign
function assignPaymentRoles(payment, roles) {
    // Vulnerable to prototype pollution
    return _.assign(payment, roles);
}

// Intentionally vulnerable: Unsafe type checking with isString
function validatePaymentInput(input) {
    // Vulnerable: isString can be bypassed through prototype pollution
    if (!_.isString(input)) {
        throw new Error('Input must be a string');
    }
    return input;
}

// Intentionally vulnerable: Unsafe type checking in object validation
function validatePaymentObject(payment) {
    // Vulnerable: Multiple type checks can be bypassed
    if (!_.isString(payment.cardNumber) || !_.isString(payment.cvv)) {
        throw new Error('Invalid payment object');
    }
    return payment;
}

// Intentionally vulnerable: Chained type checking
function processPaymentData(data) {
    // Vulnerable: Chained type checks can be bypassed
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

// These operations would pollute the Object prototype
mergePaymentData({}, maliciousPayload);
setPaymentProperty({}, "__proto__.isAdmin", true);
setDefaultPaymentSettings({}, maliciousPayload);
extendPaymentProfile({}, maliciousPayload);
assignPaymentRoles({}, maliciousPayload);

// Bypass type checking
validatePaymentInput({});  // Will pass if prototype is polluted
validatePaymentObject({}); // Will pass if prototype is polluted
processPaymentData({});    // Will pass if prototype is polluted
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
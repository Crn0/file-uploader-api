import BaseError from './base.error.js';

class APIError extends BaseError {
    constructor(message, httpCode, name = 'API Error', isOperational = true) {
        super(httpCode, message, name, isOperational);
    }
}

export default APIError;

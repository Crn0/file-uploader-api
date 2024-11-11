import BaseError from './base.error.js';

class AuthError extends BaseError {
    constructor(
        message,
        httpCode,
        errors = [],
        name = 'Auth Error',
        isOperational = true
    ) {
        super(message, httpCode, name, errors, isOperational);
    }
}

export default AuthError;

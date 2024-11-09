import BaseError from './base.error.js';

class AuthError extends BaseError {
    constructor(
        message,
        description,
        httpCode,
        name = 'Auth Error',
        isOperational = true
    ) {
        super(message, description, httpCode, name, isOperational);
    }
}

export default AuthError;

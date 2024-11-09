import BaseError from './base.error.js';

class FormError extends BaseError {
    constructor(
        message,
        errors,
        httpCode,
        name = 'Form Error',
        isOperational = true
    ) {
        super(name, httpCode, message, errors, isOperational);
    }
}

export default FormError;

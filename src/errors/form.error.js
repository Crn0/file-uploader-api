import BaseError from './base.error.js';

class FormError extends BaseError {
    constructor(
        message,
        errors,
        httpCode = 422,
        name = 'Form Error',
        isOperational = true
    ) {
        super(message, httpCode, name, errors, isOperational);
    }
}

export default FormError;

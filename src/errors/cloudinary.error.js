import BaseError from './base.error.js';

class CloudinrayError extends BaseError {
    constructor(
        message,
        httpCode,
        errors = [],
        name = 'Cloudinary Error',
        isOperational = true
    ) {
        super(message, httpCode, name, errors, isOperational);
    }
}

export default CloudinrayError;

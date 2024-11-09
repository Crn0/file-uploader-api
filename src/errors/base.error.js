class BaseError extends Error {
    constructor(name, httpCode, message, errors, description, isOperational) {
        super(message);
        this.name = name;
        this.httpCode = httpCode;
        this.description = description;
        this.isOperational = isOperational;
        this.errors = errors;
    }
}

export default BaseError;
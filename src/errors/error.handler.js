import 'dotenv/config';
import BaseError from './base.error.js';
import FieldError from './field.error.js';

class ErrorHandler {
    static handleError(error, res) {
        if (process.env.NODE_ENV === 'dev') {
            console.log(error);
        }

        if (error instanceof FieldError) {
            return res.status(error.httpCode).json({
                code: error.httpCode,
                errors: error.errors || null,
                message: error.message,
            });
        }

        return res.status(error.httpCode).json({
            code: error.httpCode,
            message: error.message,
        });
    }

    static isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }

        return false;
    }
}

export default Object.freeze(ErrorHandler);

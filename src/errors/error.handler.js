import 'dotenv/config';
import BaseError from './base.error.js';
import FormError from './form.error.js';

class ErrorHandler {
    static handleError(error, res) {
        if (process.env.NODE_ENV === 'dev') {
            console.log(error);
        }

        if (error instanceof FormError) {
            return res.status(error.httpCode).json({
                code: error.httpCode,
                errors: error.errors || null,
                message: error.message,
            });
        }

        return res.status(error.httpCode).json({
            code: error.httpCode,
            message: error.message,
            description: error.description,
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

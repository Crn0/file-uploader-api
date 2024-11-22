import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import FieldError from '../errors/field.error.js';

const validationError = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorFields = errors.array().map((err) => {
            const { type, msg: message, path: field } = err;

            return {
                type,
                field,
                message,
            };
        });

        throw new FieldError('Validation Failed', errorFields, 422);
    }

    next();
});

export default validationError;

import multer from 'multer';
import upload from '../configs/multer/index.js';
import FieldError from '../errors/field.error.js';
import BaseError from '../errors/base.error.js';
import APIError from '../errors/api.error.js';

const multerUpload = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return next(
                new FieldError(
                    'Validation Faield',
                    {
                        type: 'field',
                        field: err.field,
                        message: err.message,
                    },
                    err.cause
                )
            );
        }

        if (err instanceof BaseError) return next(err);

        if (err)
            return next(
                new APIError(
                    'Something wrong ocurred when trying to upload the file',
                    500
                )
            );

        return next();
    });
};

export default multerUpload;

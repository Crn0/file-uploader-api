import { param } from 'express-validator';

const entityId = (idParam) =>
    param(idParam)
        .trim()
        .notEmpty()
        .withMessage(`The ${idParam} parameter cannot be empty`)
        .isNumeric()
        .withMessage(`The ${idParam} parameter must be a numeric value`)
        .escape();

const token = () =>
    param('token')
        .trim()
        .notEmpty()
        .withMessage('The token parameter cannot be empty');

export default {
    entityId,
    token,
};

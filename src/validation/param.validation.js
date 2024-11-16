import { param } from 'express-validator';

const entityId = (idParam) =>
    param(idParam)
        .trim()
        .notEmpty()
        .withMessage(`The ${idParam} parameter cannot be empty`)
        .isNumeric()
        .withMessage(`The ${idParam} parameter must be a numeric value`)
        .escape();

export default {
    entityId,
};

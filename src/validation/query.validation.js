import { query } from 'express-validator';

const includes = (isSupported) =>
    isSupported
        ? query('includes').trim().escape()
        : query('includes')
              .isEmpty()
              .withMessage('Embed request is not supported')
              .escape();

const ownerId = () =>
    query('ownerId')
        .trim()
        .notEmpty()
        .withMessage("The 'ownerId' query parameter cannot be empty")
        .isNumeric()
        .withMessage("The 'ownerId' query parameter must be a numeric value")
        .escape();

const parentId = () =>
    query('parentId')
        .trim()
        .notEmpty()
        .withMessage("The 'parentId' query parameter cannot be empty");

export default {
    folder: (method) => {
        const methodName = method.toLowerCase();
        const reqObject = {
            root: includes(true),
            get: [ownerId(), includes(true)],
            post: includes(true),
            delete: includes(false),
        };

        if (reqObject[methodName]) return reqObject[methodName];

        throw new Error(`invalid http method ${method}`);
    },
};

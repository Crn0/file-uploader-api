import { query } from 'express-validator';

const includes = (isSupported) =>
    isSupported
        ? query('includes').trim().escape()
        : query('includes')
              .isEmpty()
              .withMessage('Embed request is not supported')
              .escape();

const entityId = (id) =>
    query(id)
        .trim()
        .notEmpty()
        .withMessage(`The ${id} query parameter cannot be empty`)
        .escape();

const expiresIn = () =>
    query('expiresIn')
        .trim()
        .custom((val) => {
            if (!val) return true;
            // https://regexr.com/88vqv
            const regex = /^[0-9]{1,}?$|^[0-9]{1,}[smhd]?$/;

            return regex.test(val);
        })
        .withMessage(
            'Invalid time format. Supported formats are: 10s for seconds, 10m for minutes, 10h for hours, 10d for days'
        );

const fileAction = () =>
    query('action')
        .trim()
        .custom((val, { req }) => {
            if (req.shareToken.type === 'folder' && !req.query.fileId)
                return true;

            return ['metadata', 'preview', 'download'].includes(
                val.trim().toLowerCase()
            );
        })
        .withMessage(
            "Invalid 'action' query parameter value. Valid values are: metadata, preview or download"
        );

const subEntity = (id) =>
    query(id)
        .trim()
        .custom((val) => {
            if (!val) return true;

            return Number.isNaN(Number(val)) === false;
        })
        .withMessage(`The '${id}' query parameter must be a numeric value`);

export default {
    folder: (method) => {
        const methodName = method.toLowerCase();
        const reqObject = {
            root: includes(true),
            'get:link': [includes(false), expiresIn()],
            get: includes(true),
            post: includes(true),
            delete: includes(false),
        };

        if (reqObject[methodName]) return reqObject[methodName];

        throw new Error(`invalid http method ${method}`);
    },
    file: (method, ...idQueryParam) => {
        const methodName = method.toLowerCase();
        const reqObject = {
            get: includes(false),
            'get:link': [includes(false), expiresIn()],
            post: [
                idQueryParam.map((idName) => entityId(idName)),
                includes(false),
            ].flat(Infinity),
            delete: includes(false),
        };

        if (reqObject[methodName]) return reqObject[methodName];

        throw new Error(`invalid http method ${method}`);
    },
    share: (method) => {
        const methodName = method.toLowerCase();
        const reqObject = {
            get: [
                includes(true),
                fileAction(),
                subEntity('folderId'),
                subEntity('fileId'),
            ],
        };

        if (reqObject[methodName]) return reqObject[methodName];

        throw new Error(`invalid http method ${method}`);
    },
};

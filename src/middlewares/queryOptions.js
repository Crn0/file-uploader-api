import asyncHandler from 'express-async-handler';
import helpers from '../helpers/controllers/index.js';
import queryValidKeys from '../configs/queryValidKeys/index.js';

const { optionIncludes, pagination } = helpers;

const folderValidKeys = {
    folders: queryValidKeys.folders,
    files: queryValidKeys.files,
};

const sortBy = (query, options, validKeys) => {
    const sortKey =
        query.sortBy
            ?.split(/[x^+-]/)
            ?.join('')
            ?.trim() || 'name';

    const sortOrder = query.sortBy?.includes('-') ? 'desc' : 'asc';

    const optionRef = options;
    const folderFields = validKeys.folders;
    const fileFields = validKeys.files;

    if (folderFields[sortKey]) {
        optionRef.folders = {
            ...optionRef.folders,
            orderBy: {
                [sortKey]: sortOrder,
            },
        };
    }

    if (fileFields[sortKey]) {
        optionRef.files = {
            ...optionRef.files,
            orderBy: {
                [sortKey]: sortOrder,
            },
        };
    }

    return optionRef;
};

const optionWrapper = (queryObj, validKeys) => {
    const options = optionIncludes(queryObj, validKeys);
    const { take, skip } = pagination(queryObj);

    if (options.folders) {
        if (typeof options.folders !== 'object') {
            options.folders = {};
        }

        options.folders.take = take;
        options.folders.skip = skip;
    }

    if (options.files) {
        if (typeof options.files !== 'object') {
            options.files = {};
        }
        options.files.skip = skip;
        options.files.take = take;
    }

    sortBy(queryObj, options, validKeys);

    return {
        options,
        take,
        skip,
    };
};

const queryOptions = asyncHandler(async (req, res, next) => {
    const { options, take, skip } = optionWrapper(req.query, folderValidKeys);

    req.includes = options;

    req.pagination = {
        take,
        skip,
    };

    next();
});

export default queryOptions;

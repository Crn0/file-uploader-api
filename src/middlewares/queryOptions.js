import asyncHandler from 'express-async-handler';
import helpers from '../helpers/controllers/index.js';
import queryValidKeys from '../configs/queryValidKeys/index.js';

const { optionIncludes, pagination } = helpers;

const folderValidKeys = {
    folders: queryValidKeys.folders,
    files: queryValidKeys.files,
};

const sortBy = (string, allowList) => {
    const sortKey =
        string
            ?.split(/[x^+-]/)
            ?.join('')
            ?.trim() || 'name';
    const sortOrder = string?.includes('-') ? 'desc' : 'asc';

    const isAllowed = allowList.includes(sortKey);

    if (isAllowed) {
        return {
            orderBy: {
                [sortKey]: sortOrder,
            },
        };
    }

    return null;
};

const queryOptions = asyncHandler(async (req, res, next) => {
    const options = optionIncludes(req.query, folderValidKeys);
    const sortOption = sortBy(req.query.sortBy, ['name']);
    const { take, skip } = pagination(req.query);

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

    if (sortOption) {
        options.folders = { ...options.folders, ...sortOption };
        options.files = { ...options.files, ...sortOption };
    }

    req.includes = options;

    req.pagination = {
        take,
        skip,
    };

    next();
});

export default queryOptions;

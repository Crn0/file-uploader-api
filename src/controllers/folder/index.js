import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import folderService from '../../services/folder.service.js';
import storageFactory from '../../storages/index.js';
import helpers from '../../helpers/controllers/index.js';
import queryValidKeys from '../../configs/queryValidKeys/index.js';
import FieldError from '../../errors/field.error.js';
import APIError from '../../errors/api.error.js';

const { optionIncludes, pagination } = helpers;

const folderValidKeys = {
    folders: queryValidKeys.folders,
    files: queryValidKeys.files,
};

const createSubFolder = asyncHandler(async (req, res, _) => {
    const { name } = req.body;
    const userId = Number(req.user.id);
    const folderId = Number(req.params.folderId);

    const storage = storageFactory().createStorage('cloudinary');

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

        throw new FieldError('Validation Failed', errorFields, 400);
    }

    const rootFolder = await folderService.getRootFolder(userId);
    const parentFolder = await folderService.getFolder(folderId);

    if (!rootFolder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (!parentFolder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const options = optionIncludes(req.query, folderValidKeys);
    const nameCount = await folderService.getFolderNameCountByUserId(
        userId,
        name
    );
    const path = `${rootFolder.path}/${name}_${nameCount + 1}`;

    const folder = await folderService.createSubFolder(
        userId,
        parentFolder.id,
        name,
        path,
        options
    );

    await storage.createFolder(path);

    res.status(200).json({
        folder,
    });
});

const getRootFolder = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const userId = Number(user.id);

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

        throw new FieldError('Validation Failed', errorFields, 400);
    }

    const options = optionIncludes(req.query, folderValidKeys);
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

    const folder = await folderService.getRootFolder(userId, options);

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const folderId = folder.id;
    const { ownerId } = folder;

    const path = await folderService.getFolderPath(ownerId, folderId);

    const total = await folderService.getResourcesTotalCount(userId, folderId);

    return res.status(202).json({
        path,
        data: {
            folder,
        },
        pagination: {
            take,
            skip,
            total,
        },
    });
});

const getFolder = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const folderId = Number(req.params.folderId);
    const ownerId = Number(req.query.ownerId);
    const userId = Number(user.id);

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

        throw new FieldError('Validation Failed', errorFields, 400);
    }

    if (ownerId !== userId) {
        if (user.role !== 'admin')
            throw new APIError(
                'Permission Denied: You do not have the necessary permissions to access this resource',
                403
            );
    }

    const options = optionIncludes(req.query, folderValidKeys);
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

    const folder = await folderService.getFolderByUserId(
        ownerId,
        folderId,
        options
    );

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const path = await folderService.getFolderPath(ownerId, folderId);

    const total = await folderService.getResourcesTotalCount(ownerId, folderId);

    return res.status(200).json({
        path,
        data: {
            folder,
        },
        pagination: {
            take,
            skip,
            total,
        },
    });
});

const deleteFolder = asyncHandler(async (req, res, _) => {
    const userId = Number(req.user?.id);
    const folderId = Number(req.params.folderId);

    const errors = validationResult(req);
    const storage = storageFactory().createStorage('cloudinary');

    if (!errors.isEmpty()) {
        const errorFields = errors.array().map((err) => {
            const { type, msg: message, path: field } = err;

            return {
                type,
                field,
                message,
            };
        });

        throw new FieldError('Validation Failed', errorFields, 400);
    }

    const folderExist = await folderService.getFolder(folderId);
    const ownerId = folderExist?.ownerId;

    if (!folderExist) {
        throw new APIError(
            'The item you are attempting to delete could not be found. Please check the resource ID',
            404
        );
    }

    if (userId !== ownerId) {
        if (req.user.role !== 'admin')
            throw new APIError(
                'You do not have the required permissions to delete this resource',
                403
            );
    }

    await folderService.deleteFolder(
        ownerId,
        folderExist,
        storage.destroyFolder
    );

    res.sendStatus(204);
});

export default {
    createSubFolder,
    getRootFolder,
    getFolder,
    deleteFolder,
};

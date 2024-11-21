import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
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

    const parentFolder = await folderService.getFolder(folderId);

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
    const path = `${parentFolder.path}/${name}_${nameCount + 1}`;

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

const generateLink = asyncHandler(async (req, res, _) => {
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

    const { user } = req;
    const folderId = Number(req.params.folderId);

    const folder = await folderService.getSubFolder(folderId);

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (folder.ownerId === user.id) {
        const token = jwt.sign(
            {
                id: folder.id,
            },
            process.env.FOLDER_SHARE_URL_SECRET,
            {
                expiresIn: req.query.expiresIn || 60 * 60, // default one hour
            }
        );

        const url = `${process.env.SERVER_URL}/api/v1/share/folders/${token}`;

        res.status(200).json({
            url,
        });
    } else {
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }
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

    const folder = await folderService.getFolder(folderId, options);

    if (folder.id === userId || user.role === 'admin') {
        if (!folder)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        const path = await folderService.getFolderPath(folder.id, folderId);

        const total = await folderService.getResourcesTotalCount(
            folder.id,
            folderId
        );

        res.status(200).json({
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
    } else {
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }
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

    if (!folderExist) {
        throw new APIError(
            'The resource you are attempting to delete could not be found. Please check the resource ID',
            404
        );
    }

    if (userId === folderExist.ownerId || req.user.role === 'admin') {
        await storage.destroyNestedFiles(folderExist.path);

        await storage.destroyFolder(folderExist.path);

        await folderService.deleteFolder(folderExist);

        res.sendStatus(204);
    } else {
        throw new APIError(
            'You do not have the required permissions to delete this resource',
            403
        );
    }
});

export default {
    createSubFolder,
    getRootFolder,
    generateLink,
    getFolder,
    deleteFolder,
};

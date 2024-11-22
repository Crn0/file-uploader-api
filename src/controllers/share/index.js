import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import folderService from '../../services/folder.service.js';
import helpers from '../../helpers/controllers/index.js';
import storageFactory from '../../storages/index.js';
import queryValidKeys from '../../configs/queryValidKeys/index.js';
import APIError from '../../errors/api.error.js';
import fileService from '../../services/file.service.js';

const { optionIncludes, pagination } = helpers;

const folderValidKeys = {
    folders: queryValidKeys.folders,
    files: queryValidKeys.files,
};

const getFolder = asyncHandler(async (req, res, next) => {
    if (req.query.type === 'folder') {
        const folderId = Number(req.shareToken.id);

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
        next();
    }
});

const getFileMetaData = asyncHandler(async (req, res, next) => {
    if (req.query.action === 'metadata') {
        const fileId = Number(req.shareToken.id);

        const file = await fileService.getFile(fileId);

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        res.status(200).json({ file });
    } else {
        next();
    }
});

const getFileContent = asyncHandler(async (req, res, next) => {
    if (req.query.action === 'download') {
        const fileId = Number(req.shareToken.id);

        const file = await fileService.getFile(fileId);

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        const storage = storageFactory().createStorage('cloudinary');

        const fileURL = storage.fileDownload(file);

        res.redirect(fileURL);
    } else {
        next();
    }
});

const previewFile = asyncHandler(async (req, res, next) => {
    if (req.query.action === 'preview') {
        const { transformations } = req.query;
        const fileId = Number(req.shareToken.id);

        const file = await fileService.getFile(fileId);

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (file.extension === 'epub')
            throw new APIError(
                'Files that have the .epub extension cannot be previewed',
                400
            );

        const storage = storageFactory().createStorage('cloudinary');

        const imageURL = storage.fileURL(file, {
            // covernt the transformation query string to object
            ...transformations?.split(',')?.reduce((obj, _) => {
                const str = _?.split('=');
                const key = str[0];
                const value = str[1];

                return {
                    ...obj,
                    [key]: value,
                };
            }, {}),
        });

        res.status(200).json({
            url: imageURL,
        });
    } else {
        next();
    }
});

export default {
    getFolder,
    getFileMetaData,
    getFileContent,
    previewFile,
};

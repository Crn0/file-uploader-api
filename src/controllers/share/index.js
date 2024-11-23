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
    if (req.query.type !== 'folder') return next();

    // if the request includes a folderId pass it to the next middleware
    if (req.query.fileId) return next();

    // if the shared folder ID and the sub folder ID is the same
    // throw an error
    if (req.shareToken.id === Number(req.query.folderId))
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    let folder;
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

    // if there is a child id query the child folder
    // else query the parent folder
    if (req.query.folderId) {
        folder = await folderService.getFolder(
            Number(req.query.folderId),
            options
        );
    } else {
        folder = await folderService.getFolder(
            Number(req.shareToken.id),
            options
        );
    }

    const path = await folderService.getFolderPath(folder.ownerId, folder.id);
    const total = await folderService.getResourcesTotalCount(
        folder.ownerId,
        folder.id
    );

    const isValidPath = path.map(
        (pathObj) => req.shareToken.id === pathObj.parentId
    );

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (!isValidPath.some((p) => p === true))
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

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

const getFileMetaData = asyncHandler(async (req, res, next) => {
    if (req.query.action === 'metadata') {
        const fileId = Number(req.query.fileId) || Number(req.shareToken.id);

        const file = await fileService.getFile(fileId);
        const path = await folderService.getFolderPath(
            file.ownerId,
            file.folderId
        );

        const isValidPath = path.map(
            (pathObj) => req.shareToken.id === pathObj.parentId
        );

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (!isValidPath.some((p) => p === true))
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
        const fileId = Number(req.query.fileId) || Number(req.shareToken.id);

        const file = await fileService.getFile(fileId);
        const path = await folderService.getFolderPath(
            file.ownerId,
            file.folderId
        );

        const isValidPath = path.map(
            (pathObj) => req.shareToken.id === pathObj.parentId
        );

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (!isValidPath.some((p) => p === true))
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
        const fileId = Number(req.query.fileId) || Number(req.shareToken.id);

        const file = await fileService.getFile(fileId);
        const path = await folderService.getFolderPath(
            file.ownerId,
            file.folderId
        );

        const isValidPath = path.map(
            (pathObj) => req.shareToken.id === pathObj.parentId
        );

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (!isValidPath.some((p) => p === true))
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
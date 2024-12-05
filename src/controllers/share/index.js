import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import folderService from '../../services/folder.service.js';
import storageFactory from '../../storages/index.js';
import APIError from '../../errors/api.error.js';
import fileService from '../../services/file.service.js';

const getFolder = asyncHandler(async (req, res, next) => {
    if (req.shareToken.type !== 'folder') return next();

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
    const {
        includes,
        pagination: { take, skip },
    } = req;

    // if there is a child id query the child folder
    // else query the parent folder
    if (req.query.folderId) {
        folder = await folderService.getFolder(
            Number(req.query.folderId),
            includes
        );
    } else {
        folder = await folderService.getFolder(
            Number(req.shareToken.id),
            includes
        );
    }

    const path = await folderService.getFolderPath(folder.ownerId, folder.id);
    const total = await folderService.getResourcesTotalCount(
        folder.ownerId,
        folder.id
    );

    const isValidPathChildPath = path.map(
        (pathObj) => req.shareToken.id === pathObj.parentId
    );

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );
    // if the query is for the sub folder
    // check if the sub folder path containts the shared folderId
    // if not throw an error
    if (req.params.folderId && !isValidPathChildPath.some((p) => p === true))
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
    if (req.query.action !== 'metadata') return next();

    if (req.shareToken.type === 'folder') {
        const fileId = Number(req.query.fileId);

        const file = await fileService.getFile(fileId);
        const path = await folderService.getFolderPath(
            file.ownerId,
            file.folderId
        );

        const isNotValidPath =
            path
                .map((pathObj) => req.shareToken.id === pathObj.id)
                .some((bool) => bool === true) === false;

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (req.query.fileId && isNotValidPath)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        return res.status(200).json({ file });
    }

    const fileId = Number(req.shareToken.id);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    return res.status(200).json({ file });
});

const getFileContent = asyncHandler(async (req, res, next) => {
    if (req.query.action !== 'download') return next();

    if (req.shareToken.type === 'folder') {
        const fileId = Number(req.query.fileId);

        const file = await fileService.getFile(fileId);
        const path = await folderService.getFolderPath(
            file.ownerId,
            file.folderId
        );

        const isNotValidPath =
            path
                .map((pathObj) => req.shareToken.id === pathObj.id)
                .some((bool) => bool === true) === false;

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (req.query.fileId && isNotValidPath)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        const storage = storageFactory().createStorage('cloudinary');

        const fileURL = storage.fileDownload(file);

        return res.redirect(fileURL);
    }

    const fileId = Number(req.shareToken.id);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const storage = storageFactory().createStorage('cloudinary');

    const fileURL = storage.download(file);

    return res.redirect(fileURL);
});

const previewFile = asyncHandler(async (req, res, next) => {
    if (req.query.action !== 'preview') return next();

    if (req.shareToken.type === 'folder') {
        const { transformations } = req.query;
        const fileId = Number(req.query.fileId);
        const file = await fileService.getFile(fileId);
        const path = await folderService.getFolderPath(
            file.ownerId,
            file.folderId
        );

        const isNotValidPath =
            path
                .map((pathObj) => req.shareToken.id === pathObj.id)
                .some((bool) => bool === true) === false;

        if (!file)
            throw new APIError(
                'The resource could not be found on the server',
                404
            );

        if (req.query.fileId && isNotValidPath)
            throw new APIError(
                'The resource could not be found on the server',
                404
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

        return res.status(200).json({
            url: imageURL,
        });
    }

    const fileId = Number(req.shareToken.id);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const storage = storageFactory().createStorage('cloudinary');

    const imageURL = storage.preview(file);

    return res.status(200).json({
        url: imageURL,
    });
});

export default {
    getFolder,
    getFileMetaData,
    getFileContent,
    previewFile,
};

import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import folderService from '../../services/folder.service.js';
import storageFactory from '../../storages/index.js';
import APIError from '../../errors/api.error.js';

const createSubFolder = asyncHandler(async (req, res, _) => {
    const { name } = req.body;

    const folderId = Number(req.params.folderId);

    const storage = storageFactory().createStorage('cloudinary');

    const { includes } = req;

    const parentFolder = await folderService.getFolder(folderId);

    if (!parentFolder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const nameCount = await folderService.getFolderNameCountByUserId(
        req.user.id,
        name
    );
    const path = `${parentFolder.path}/${name}_${nameCount + 1}`;

    const folder = await folderService.createSubFolder(
        req.user.id,
        parentFolder.id,
        name,
        path,
        includes
    );

    await storage.createFolder(path);

    res.status(200).json({
        folder,
    });
});

const generateLink = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const folderId = Number(req.params.folderId);

    const folder = await folderService.getSubFolder(folderId);

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (folder.ownerId !== user.id) {
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }

    const token = jwt.sign(
        {
            id: folder.id,
            type: 'folder',
        },
        process.env.SHARE_URL_SECRET,
        {
            expiresIn: req.query.expiresIn || 60 * 60, // default one hour
        }
    );

    const url = `${process.env.FRONTEND_URL}/share?token=${token}`;

    res.status(200).json({
        url,
    });
});

const getRootFolder = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const {
        includes,
        pagination: { take, skip },
    } = req;

    const folder = await folderService.getRootFolder(user.id, includes);

    if (!folder)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    const folderId = folder.id;
    const { ownerId } = folder;

    const path = await folderService.getFolderPath(ownerId, folderId);

    const total = await folderService.getResourcesTotalCount(user.id, folderId);

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
    const {
        includes,
        pagination: { take, skip },
    } = req;
    const folderId = Number(req.params.folderId);

    const folder = await folderService.getFolder(folderId, includes);

    if (!folder) {
        throw new APIError(
            'The resource could not be found on the server',
            404
        );
    }

    if (folder.ownerId !== user.id) {
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }

    const path = await folderService.getFolderPath(folder.ownerId, folder.id);

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
});

const deleteFolder = asyncHandler(async (req, res, _) => {
    const userId = Number(req.user?.id);
    const folderId = Number(req.params.folderId);

    const storage = storageFactory().createStorage('cloudinary');

    const folderExist = await folderService.getFolder(folderId);

    if (!folderExist) {
        throw new APIError(
            'The resource you are attempting to delete could not be found. Please check the resource ID',
            404
        );
    }

    if (userId !== folderExist.ownerId) {
        throw new APIError(
            'You do not have the required permissions to delete this resource',
            403
        );
    }

    await storage.destroyNestedFiles(folderExist.path);

    await storage.destroyFolder(folderExist.path);

    await folderService.deleteFolder(folderExist);

    res.sendStatus(204);
});

export default {
    createSubFolder,
    getRootFolder,
    generateLink,
    getFolder,
    deleteFolder,
};

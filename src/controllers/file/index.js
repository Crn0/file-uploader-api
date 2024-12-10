import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import fileService from '../../services/file.service.js';
import folderService from '../../services/folder.service.js';
import storageFactory from '../../storages/index.js';
import FieldError from '../../errors/field.error.js';
import APIError from '../../errors/api.error.js';

const fileExtensions = (mimeType) => {
    switch (mimeType) {
        case 'image/png':
            return 'png';
        case 'image/jpeg':
            return 'jpeg';
        case 'image/jpg':
            return 'jpeg';
        case 'image/webp':
            return 'webp';
        case 'application/epub+zip':
            return 'epub';
        default:
            throw new Error(`Invalid ${mimeType}`);
    }
};

const expiresIn = (time) => {
    switch (time[time.length - 1]) {
        case 's':
            return Date.now() + time.replace(/[^0-9]/g, '') * 1000;

        case 'm':
            return Date.now() + time.replace(/[^0-9]/g, '') * 60 * 1000;

        case 'h':
            return Date.now() + time.replace(/[^0-9]/g, '') * 60 * 60 * 1000;

        case 'd':
            return (
                Date.now() + time.replace(/[^0-9]/g, '') * 24 * 60 * 60 * 1000
            );

        default:
            return Date.now() + 60 * 60 * 1000;
    }
};

const createFile = asyncHandler(async (req, res, _) => {
    const folderId = Number(req.query?.folderId);
    const ownerId = req.user.id;

    const storage = storageFactory().createStorage('cloudinary');
    const parentFolder = await folderService.getFolderByUserId(
        ownerId,
        folderId
    );

    if (!req.file) {
        throw new FieldError('File upload required', {
            type: 'fields',
            field: 'file',
            message: 'No file was uploaded. Please attach a file and try again',
        });
    }

    if (!parentFolder) {
        throw new APIError(
            `The folder with the ID ${folderId} cannot be found on this server`,
            404
        );
    }

    const fileUpload = await storage.createFile(
        parentFolder.path,
        req.file.path,
        req.file.mimetype,
        {
            height: 500,
            width: 800,
            crop: 'auto_pad',
        }
    );

    const { originalname } = req.file;

    const fileName =
        `${originalname.substring(0, originalname.lastIndexOf('.'))}` ||
        originalname;

    const nameCount = await fileService.getFileNameCount(ownerId, fileName);

    const {
        version,
        public_id: publicId,
        resource_type: resourceType,
        type: deliveryType,
        bytes: size,
    } = fileUpload;

    const fileExtension = fileExtensions(req.file.mimetype);
    const file = await fileService.createFile(
        parentFolder.ownerId,
        parentFolder.id,
        (() => {
            if (!nameCount) return `${fileName}`;

            return `${fileName}-${nameCount}`;
        })(),
        publicId,
        size,
        version,
        fileExtension,
        resourceType,
        deliveryType
    );

    res.status(200).json({
        file,
    });
});

const generateLink = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (file.ownerId !== user.id)
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );

    const storage = storageFactory().createStorage('cloudinary');

    const url = storage.preview(file, expiresIn(req.query.expiresIn));

    return res.status(200).json({
        url,
        action: 'file:share',
    });
});

const getFileMetaData = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );
    if (file.ownerId !== user.id)
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );

    return res.status(200).json({
        file,
        action: 'file:metadata',
    });
});

const getFileContent = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (file.ownerId !== user.id)
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    const storage = storageFactory().createStorage('cloudinary');

    const fileURL = storage.download(file);

    return res.status(302).json({
        url: fileURL,
    });
});

const deleteFile = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const fileExist = await fileService.getFile(fileId);

    if (!fileExist) return res.sendStatus(204);

    if (fileExist.ownerId !== user.id) {
        throw new APIError(
            'You do not have the required permissions to delete this resource',
            403
        );
    }

    const storage = storageFactory().createStorage('cloudinary');

    await fileService.deleteFile(fileExist.id, storage.destroyFile);

    await fileService.deleteFile(fileExist.id, storage.destroyFile);

    return res.sendStatus(204);
});

const previewFile = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (file.ownerId !== user.id)
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );

    if (file.extension === 'epub')
        throw new APIError(
            'Files that have the .epub extension cannot be previewed',
            400
        );

    const storage = storageFactory().createStorage('cloudinary');

    const imageURL = storage.preview(file);

    return res.status(200).json({
        url: imageURL,
        action: 'file:preview',
        fileName: file.name,
    });
});

export default {
    createFile,
    generateLink,
    previewFile,
    getFileMetaData,
    getFileContent,
    deleteFile,
};

import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
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

    if (file.ownerId === user.id) {
        const token = jwt.sign(
            {
                id: file.id,
            },
            process.env.FILE_SHARE_URL_SECRET,
            {
                expiresIn: req.query.expiresIn || 60 * 60, // default one hour
            }
        );

        const url = `${process.env.SERVER_URL}/api/v1/share/${token}?type=file&action=metadata`;

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

const getFileMetaData = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const file = await fileService.getFile(fileId);

    if (!file)
        throw new APIError(
            'The resource could not be found on the server',
            404
        );

    if (file.ownerId === user.id || user.role === 'admin') {
        res.status(200).json(file);
    } else {
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }
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

    if (file.ownerId === user.id || user.role === 'admin') {
        const storage = storageFactory().createStorage('cloudinary');

        const fileURL = storage.fileDownload(file);

        res.redirect(fileURL);
    } else {
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }
});

const deleteFile = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const fileId = Number(req.params.fileId);

    const fileExist = await fileService.getFile(fileId);

    if (!fileExist)
        throw new APIError(
            'The resource you are attempting to delete could not be found. Please check the resource ID',
            404
        );

    if (fileExist.ownerId === user.id || user.role === 'admin') {
        const storage = storageFactory().createStorage('cloudinary');

        await fileService.deleteFile(fileExist.id, storage.destroyFile);

        res.sendStatus(204);
    } else {
        throw new APIError(
            'You do not have the required permissions to delete this resource',
            403
        );
    }
});

const previewFile = asyncHandler(async (req, res, _) => {
    const { user } = req;
    const { transformations } = req.query;
    const fileId = Number(req.params.fileId);

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

    if (file.ownerId === user.id || user.role === 'admin') {
        const storage = storageFactory().createStorage('cloudinary');

        const imageURL = storage.fileURL(file, {
            // covernt the transformation query string to object
            ...transformations?.split(',')?.reduce((obj, __) => {
                const str = __.split('=');
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
        throw new APIError(
            'Permission Denied: You do not have the necessary permissions to access this resource',
            403
        );
    }
});

export default {
    createFile,
    generateLink,
    previewFile,
    getFileMetaData,
    getFileContent,
    deleteFile,
};

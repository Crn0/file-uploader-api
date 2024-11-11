import client from '../db/client.js';
import helpers from '../helpers/queries/index.js';

const { optionFn } = helpers;

const defaultOptions = {
    id: true,
    name: true,
    thumbnail: true,
    publicId: true,
    size: true,
    version: true,
    resourceType: true,
    deliveryType: true,
    folderId: true,
    createdAt: true,
    updatedAt: true,
};

const createFile = async (
    folderId,
    name,
    thumbnail,
    publicId,
    resourceType,
    deliveryType,
    size,
    options
) => {
    const fileOption = optionFn(options, defaultOptions);

    const file = await client.file.create({
        data: {
            name,
            thumbnail,
            publicId,
            resourceType,
            deliveryType,
            size,
            Folder: {
                connect: {
                    id: folderId,
                },
            },
        },
        select: {
            ...fileOption,
        },
    });

    return file;
};

const getFile = async (id, options) => {
    const fileOption = optionFn(options, defaultOptions);

    const file = await client.file.findUnique({
        where: {
            id,
        },
        select: { ...fileOption },
    });

    return file;
};

const getFileByFolderId = async (folderId, fileId, options) => {
    const fileOption = optionFn(options, defaultOptions);

    const file = await client.file.findUnique({
        where: {
            folderId,
            id: fileId,
        },
        select: { ...fileOption },
    });

    return file;
};

const deleteFile = async (id) => client.file.delete({ where: { id } });

export default {
    createFile,
    getFile,
    getFileByFolderId,
    deleteFile,
};

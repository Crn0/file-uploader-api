import client from '../db/client.js';

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
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return file;
};

const getFile = async (id, options) => {
    const file = await client.file.findUnique({
        where: {
            id,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return file;
};

const getFileByFolderId = async (folderId, fileId, options) => {
    const file = await client.file.findUnique({
        where: {
            folderId,
            id: fileId,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
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

import client from '../db/client.js';
import helpers from '../helpers/queries/index.js';

const { deleteNestedFolder } = helpers;

const createFolder = async (ownerId, name, path, options) => {
    const folder = await client.folder.create({
        data: {
            name,
            path,
            owner: {
                connect: {
                    id: ownerId,
                },
            },
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return folder;
};

const getRootFolder = async (id, options) => {
    const folder = await client.folder.findFirst({
        where: {
            ownerId: id,
            parentId: null,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return folder;
};

const getSubFolder = async (folderId, options) => {
    const folder = await client.folder.findUnique({
        where: {
            id: folderId,
            parentId: {
                not: null,
            },
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return folder;
};

const getSubFolderByUserId = async (userId, folderId, options) => {
    const folder = await client.folder.findUnique({
        where: {
            ownerId: userId,
            id: folderId,
            parentId: {
                not: null,
            },
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return folder;
};

const deleteFolder = async (userId, folderId, cb) => {
    if (typeof cb !== 'function') {
        throw new Error(`cb typeof ${typeof cb}; expected type of function`);
    }

    const main = await client.folder.findUnique({
        where: {
            ownerId: userId,
            id: folderId,
            parentId: {
                not: null,
            },
        },
        include: {
            folders: {
                select: {
                    id: true,
                },
            },
            files: {
                select: {
                    publicId: true,
                },
            },
        },
    });

    const subFolders = main?.folders;

    // RECURSIVELY DELETE SUB FOLDERS AND ITS FILES
    subFolders?.map(async (folder) => {
        await deleteNestedFolder(folder, cb);
    });

    await client.folder.delete({
        where: { id: folderId, parentId: { not: null } },
    });

    await cb(main.path);
};

export default {
    createFolder,
    getRootFolder,
    getSubFolder,
    getSubFolderByUserId,
    deleteFolder,
};

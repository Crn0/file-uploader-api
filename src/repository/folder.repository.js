import client from '../db/client.js';
import helpers from '../helpers/queries/index.js';

const { optionFn, deleteNestedFolder } = helpers;

const createFolder = async (ownerId, name, path, options) => {
    const folderOptions = optionFn(options, {
        id: true,
        name: true,
        path: true,
        type: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        folders: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
        files: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
    });

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
        select: {
            ...folderOptions,
        },
    });

    return folder;
};

const getRootFolder = async (id, options) => {
    const folderOptions = optionFn(options, {
        id: true,
        name: true,
        path: true,
        type: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        folders: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
        files: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
    });

    const folder = await client.folder.findFirst({
        where: {
            ownerId: id,
            systemetricFolders: {
                none: {},
            },
        },
        select: {
            ...folderOptions,
        },
    });

    return folder;
};

const getSubFolder = async (folderId, options) => {
    const folderOptions = optionFn(options, {
        id: true,
        name: true,
        path: true,
        type: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        folders: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
        files: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
    });

    const folder = await client.folder.findUnique({
        where: {
            id: folderId,
            systemetricFolders: {
                some: {},
            },
        },
        select: {
            ...folderOptions,
        },
    });

    return folder;
};

const getSubFolderByUserId = async (userId, folderId, options) => {
    const folderOptions = optionFn(options, {
        id: true,
        name: true,
        path: true,
        type: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        folders: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
        files: {
            orderBy: {
                createdAt: 'asc',
            },
            take: 10,
            skip: 0,
        },
    });

    const folder = await client.folder.findUnique({
        where: {
            ownerId: userId,
            id: folderId,
            systemetricFolders: {
                some: {},
            },
        },
        select: {
            ...folderOptions,
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
            systemetricFolders: {
                some: {},
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
        where: { id: folderId, systemetricFolders: { some: {} } },
    });

    await cb(main.path, main.files);
};

export default {
    createFolder,
    getRootFolder,
    getSubFolder,
    getSubFolderByUserId,
    deleteFolder,
};

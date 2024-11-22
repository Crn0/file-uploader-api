import client from '../db/client.js';

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

const createSubFolder = async (ownerId, parentId, name, path, options) => {
    const folder = await client.folder.create({
        data: {
            name,
            path,
            owner: {
                connect: {
                    id: ownerId,
                },
            },
            parentFolder: {
                connect: {
                    id: parentId,
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

const getFolderPath = async (ownerId, folderId) => {
    const folder = await client.folder.findMany({
        where: {
            ownerId,
            id: {
                lte: folderId,
            },
        },
        select: {
            id: true,
            name: true,
            parentId: true,
        },
    });

    return folder;
};

const getFolder = async (folderId, options) => {
    const folder = await client.folder.findUnique({
        where: {
            id: folderId,
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

const getFolderByUserId = async (userId, folderId, options) => {
    const folder = await client.folder.findUnique({
        where: {
            ownerId: userId,
            id: folderId,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return folder;
};

const getFolderNameCountByUserId = async (ownerId, name) => {
    const count = await client.folder.count({
        where: {
            ownerId,
            name,
        },
    });

    return count;
};

const getResourcesTotalCount = async (ownerId, folderId) => {
    const folders = await client.folder.count({
        where: {
            parentId: folderId,
        },
    });

    const files = await client.file.count({
        where: {
            folderId,
        },
    });

    return Math.floor(folders + files);
};

const deleteFolder = async (folderObj) => {
    const parent = await client.folder.findUnique({
        where: {
            id: folderObj.id,
        },
        include: {
            folders: {
                select: {
                    id: folderObj.id,
                    path: true,
                },
            },
        },
    });

    await Promise.all(
        parent.folders?.map?.(async (folder) => {
            if (folder) {
                await deleteFolder(folder);
            }
        })
    );

    return client.folder.delete({
        where: {
            id: folderObj.id,
        },
    });
};

export default {
    createFolder,
    createSubFolder,
    getRootFolder,
    getFolder,
    getSubFolder,
    getFolderByUserId,
    getFolderPath,
    getResourcesTotalCount,
    getFolderNameCountByUserId,
    deleteFolder,
};

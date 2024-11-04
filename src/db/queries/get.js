import client from '../client.js';
import utils from './utils/index.js';

const { optionFn } = utils;

// USER META
const userById = async (id, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.findUnique({
        where: {
            id,
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

const userByEmail = async (email, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.findUnique({
        where: {
            email,
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

const userByUsername = async (username, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.findUnique({
        where: {
            username,
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

const userByOpenId = async (tokenId, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        openIds: true,
    });

    const user = await client.user.findFirst({
        where: {
            openIds: {
                some: {
                    tokenId,
                },
            },
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

// USER RESOURCES
const userRootFolder = async (id, options) => {
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

const userFolder = async (id, options) => {
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
            id,
        },
        select: {
            ...folderOptions,
        },
    });

    return folder;
};

const userFile = async (id, options) => {
    const fileOption = optionFn(options, {
        id: true,
        name: true,
        url: true,
        publicId: true,
        resourceType: true,
        deliveryType: true,
        size: true,
        folderId: true,
        createdAt: true,
        updatedAt: true,
    });

    const file = await client.file.findUnique({
        where: { id },
        select: { ...fileOption },
    });

    return file;
};

export default {
    userById,
    userByUsername,
    userByEmail,
    userByOpenId,
    userRootFolder,
    userFolder,
    userFile,
};

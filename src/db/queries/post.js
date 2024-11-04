import client from '../client.js';
import utils from '../../helpers/queries/index.js';

const { optionFn } = utils;

const userLocal = async (username, email, password, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.create({
        data: {
            username,
            email,
            password,
        },
        select: {
            ...userOptions,
        },
    });

    delete user.password;

    return user;
};

const userOpenId = async (provider, tokenId, username, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        openIds: true,
    });

    const user = await client.openId.create({
        data: {
            provider,
            tokenId,
            user: {
                create: {
                    username,
                },
            },
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

const userFolder = async (ownerId, name, path, options) => {
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

const userFile = async (
    folderId,
    name,
    url,
    publicId,
    resourceType,
    deliveryType,
    size,
    options
) => {
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

    const file = await client.file.create({
        data: {
            name,
            url,
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

export default {
    userLocal,
    userOpenId,
    userFolder,
    userFile,
};

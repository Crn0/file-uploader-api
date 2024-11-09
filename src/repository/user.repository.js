import client from '../db/client.js';
import helpers from '../helpers/queries/index.js';

const { optionFn } = helpers;

// USER META
const getUserById = async (id, options) => {
    const userOptions = optionFn(options, {
        id: true,
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

const getUserByEmail = async (email, options) => {
    const userOptions = optionFn(options, {
        id: true,
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

const getUserByUsername = async (username, options) => {
    const userOptions = optionFn(options, {
        id: true,
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

const getUserByOpenId = async (tokenId, options) => {
    const userOptions = optionFn(options, {
        id: true,
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

const getUserRecources = async (userId, options) => {
    const userOptions = optionFn(options, {
        folders: true,
        files: true,
    });

    const resources = await client.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            ...userOptions,
        },
    });

    return resources;
};

// UPDATE USER FIELDS
const patchUsername = async (id, username, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.update({
        where: {
            id,
        },
        data: {
            username,
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

const patchPassword = async (id, password, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.update({
        where: {
            id,
        },
        data: {
            password,
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

const patchRole = async (id, role, options) => {
    const userOptions = optionFn(options, {
        username: true,
        email: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true,
    });

    const user = await client.user.update({
        where: {
            id,
        },
        data: {
            role,
        },
        select: {
            ...userOptions,
        },
    });

    return user;
};

// DELETE USER AND USER RESOURCES

const deleteUser = async (id) => client.user.delete({ where: { id } });

export default {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getUserByOpenId,
    getUserRecources,
    patchUsername,
    patchRole,
    patchPassword,
    deleteUser,
};

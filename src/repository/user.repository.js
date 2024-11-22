import client from '../db/client.js';

// USER META
const getUserById = async (id, options) => {
    const user = await client.user.findUnique({
        where: {
            id,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return user;
};

const getUserByEmail = async (email, options) => {
    const user = await client.user.findUnique({
        where: {
            email,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return user;
};

const getUserByUsername = async (username, options) => {
    const user = await client.user.findUnique({
        where: {
            username,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return user;
};

const getUserByOpenId = async (provider, tokenId, options) => {
    const user = await client.openId.findUnique({
        where: {
            provider_tokenId: {
                provider,
                tokenId,
            },
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return user;
};

const getUserRecources = async (userId, options) => {
    const resources = await client.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return resources;
};

// UPDATE USER FIELDS
const patchUsername = async (id, username) => {
    const user = await client.user.update({
        where: {
            id,
        },
        data: {
            username,
        },
    });

    return user;
};

const patchPassword = async (id, password) => {
    const user = await client.user.update({
        where: {
            id,
        },
        data: {
            password,
        },
    });

    return user;
};

const patchRole = async (id, role) => {
    const user = await client.user.update({
        where: {
            id,
        },
        data: {
            role,
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

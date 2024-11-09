import client from '../db/client.js';
import helpers from '../helpers/queries/index.js';

const { optionFn } = helpers;

const createLocal = async (username, email, password, options) => {
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

const createOpenId = async (provider, tokenId, username, options) => {
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

const blackListToken = async (userId, jwtId, expiresIn, options) => {
    const tokenOptions = optionFn(options, {
        jwtId: true,
        expiresIn: true,
        userId: true,
    });

    const token = await client.blackListToken.create({
        data: {
            jwtId,
            expiresIn,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
        select: {
            ...tokenOptions,
        },
    });

    return token;
};

const getToken = async (jwtId) =>
    client.blackListToken.findUnique({ where: { jwtId } });

export default {
    createLocal,
    createOpenId,
    blackListToken,
    getToken,
};

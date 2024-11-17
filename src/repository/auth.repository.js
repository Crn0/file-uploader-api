import client from '../db/client.js';

const createLocal = async (username, email, password, options) => {
    const user = await client.user.create({
        data: {
            username,
            email,
            password,
        },
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    delete user.password;

    return user;
};

const createOpenId = async (provider, tokenId, username, options) => {
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
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return user;
};

const blackListToken = async (userId, jwtId, expiresIn, options) => {
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
        include: {
            ...(typeof options === 'object' ? options : {}),
        },
    });

    return token;
};

const getToken = async (jwtId) =>
    client.blackListToken.findUnique({ where: { jwtId } });

const deleteExpiredTokens = async () =>
    client.blackListToken.deleteMany({
        where: {
            expiresIn: {
                lte: new Date(),
            },
        },
    });

export default {
    createLocal,
    createOpenId,
    blackListToken,
    getToken,
    deleteExpiredTokens,
};

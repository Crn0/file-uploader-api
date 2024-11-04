import client from '../client.js';
import utils from '../../helpers/queries/index.js';

const { optionFn } = utils;

const userUsername = async (id, username, options) => {
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

const userPassword = async (id, password, options) => {
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

const userRole = async (id, role, options) => {
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

export default {
    userUsername,
    userPassword,
    userRole,
};

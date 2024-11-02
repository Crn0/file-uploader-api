import client from '../client.js';
import get from './get.js';

const userLocal = async (username, email, password) => {
    const user = await client.user.create({
        data: {
            username,
            email,
            password,
        },
    });

    delete user.password;

    return user;
};

const userOpenId = async (provider, tokenId, username) => {
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
    });

    return user;
};

const userFolder = async (ownerId, name, path) => {
    const folder = await client.folder.create({
        data: {
            ownerId,
            name,
            path,
        },
    });
};

get.userFolder(1).then(console.log);

import { client } from '../db/client.cjs';

// USER META
const getUserById = async (id) => {
    const user = await client.$queryRaw`
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.password, 
            u.created_at AS "createdAt", 
            u.updated_at AS "updatedAt", 
            u.role,
            COALESCE (SUM (files.size), 0) AS "fileSize" FROM users u
        LEFT JOIN files ON u.id = files.owner_id
        WHERE u.id = ${id}
        GROUP BY u.id
        `;

    return user[0];
};

const getUserByEmail = async (email) => {
    const user = await client.$queryRaw`
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.password, 
            u.created_at AS "createdAt", 
            u.updated_at AS "updatedAt", 
            u.role,
            COALESCE (SUM (files.size), 0) AS "fileSize" FROM users u
        LEFT JOIN files ON u.id = files.owner_id
        WHERE email = ${email}
        GROUP BY u.id
        `;

    return user[0];
};

const getUserByUsername = async (username) => {
    const user = await client.$queryRaw`
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.password, 
            u.created_at AS "createdAt", 
            u.updated_at AS "updatedAt", 
            u.role,
            COALESCE (SUM (files.size), 0) AS "fileSize" FROM users u
        LEFT JOIN files ON u.id = files.owner_id
        WHERE username = ${username}
        GROUP BY u.id
        `;

    return user[0];
};

const getUserByOpenId = async (provider, tokenId) => {
    const user = await client.$queryRaw`
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.password, 
            u.created_at AS "createdAt", 
            u.updated_at AS "updatedAt", 
            u.role,
            COALESCE (SUM (files.size), 0) AS "fileSize" FROM open_ids o_id
        JOIN users u ON o_id.user_id = u.id 
        LEFT JOIN files ON u.id = files.owner_id

        WHERE provider = CAST (${provider} AS "Provider") AND token_id = ${tokenId}
        GROUP BY u.id
        `;

    return user[0];
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

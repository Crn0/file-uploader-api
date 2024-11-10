import queries from '../db/queries/index.js';

const createFolder = async (ownerId, name, path, options) => {
    const folder = await queries.post.userFolder(ownerId, name, path, options);

    return folder;
};

const getRootFolder = async (userId, options) => {
    const folder = await queries.get.userRootFolder(userId, options);

    return folder;
};

const getFolder = async (id, options) => {
    const folder = await queries.get.userFolder(id, options);

    return folder;
};

const deleteFolder = async (id, options) => {
    const folder = await queries.destroy.userFolder(id, options);

    return folder;
};

export default {
    createFolder,
    getRootFolder,
    getFolder,
    deleteFolder,
};

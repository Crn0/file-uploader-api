import queries from '../db/queries/index.js';

const createFolder = async (ownerId, name, path, options) => {
    try {
        const folder = await queries.post.userFolder(
            ownerId,
            name,
            path,
            options
        );

        return folder;
    } catch (error) {
        return error;
    }
};

const getRootFolder = async (userId, options) => {
    try {
        const folder = await queries.get.userRootFolder(userId, options);

        return folder;
    } catch (error) {
        return error;
    }
};

const getFolder = async (id, options) => {
    try {
        const folder = await queries.get.userFolder(id, options);

        return folder;
    } catch (error) {
        return error;
    }
};

const deleteFolder = async (id, options) => {
    try {
        const folder = await queries.destroy.userFolder(id, options);

        return folder;
    } catch (error) {
        return error;
    }
};

export default {
    createFolder,
    getRootFolder,
    getFolder,
    deleteFolder,
};

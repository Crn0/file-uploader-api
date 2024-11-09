import queries from '../db/queries/index.js';

const getFile = async (id, options) => {
    try {
        const file = await queries.get.userFile(id, options);

        return file;
    } catch (error) {
        return error;
    }
};

const deleteFile = async (id, options) => {
    try {
        const file = await queries.destroy.userFile(id, options);

        return file;
    } catch (error) {
        return error;
    }
};

export default {
    getFile,
    deleteFile,
};

import queries from '../db/queries/index.js';

const getFile = async (id, options) => {
    const file = await queries.get.userFile(id, options);

    return file;
};

const deleteFile = async (id, options) => {
    const file = await queries.destroy.userFile(id, options);

    return file;
};

export default {
    getFile,
    deleteFile,
};

import fileRepositroy from '../repository/file.repositroy.js';

const createFile = async (
    folderId,
    name,
    thumbnail,
    publicId,
    resourceType,
    deliveryType,
    size,
    options
) => {
    const file = await fileRepositroy.createFile(
        folderId,
        name,
        thumbnail,
        publicId,
        resourceType,
        deliveryType,
        size,
        options
    );

    return file;
};

const getFile = async (id, options) => {
    const file = await fileRepositroy.getFile(id, options);

    return file;
};

const getFileByFolderId = async (folderId, fileId, options) => {
    const file = await fileRepositroy.getFileByFolderId(
        folderId,
        fileId,
        options
    );

    return file;
};

const deleteFile = async (id) => {
    const file = await fileRepositroy.deleteFile(id);

    return file;
};

export default {
    createFile,
    getFile,
    getFileByFolderId,
    deleteFile,
};

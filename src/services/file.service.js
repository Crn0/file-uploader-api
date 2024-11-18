import fileRepositroy from '../repository/file.repositroy.js';

const createFile = async (
    ownerId,
    folderId,
    name,
    publicId,
    size,
    version,
    extension,
    resourceType,
    deliveryType,
    options
) => {
    const file = await fileRepositroy.createFile(
        ownerId,
        folderId,
        name,
        publicId,
        size,
        version,
        extension,
        resourceType,
        deliveryType,
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

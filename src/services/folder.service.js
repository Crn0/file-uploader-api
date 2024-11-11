import folderRepository from '../repository/folder.repository.js';

const createFolder = async (ownerId, name, path, options) => {
    const folder = await folderRepository.createFolder(
        ownerId,
        name,
        path,
        options
    );

    return folder;
};

const getRootFolder = async (ownerId, options) => {
    const folder = await folderRepository.getRootFolder(ownerId, options);

    return folder;
};

const getFolder = async (id, options) => {
    const folder = await folderRepository.getSubFolder(id, options);

    return folder;
};

const getSubFolderByUserId = async (userId, folderId, options) => {
    const folder = await folderRepository.getSubFolderByUserId(
        userId,
        folderId,
        options
    );

    return folder;
};

const deleteFolder = async (userId, folderId, cb) => {
    const folder = await folderRepository.deleteFolder(userId, folderId, cb);

    return folder;
};

export default {
    createFolder,
    getRootFolder,
    getFolder,
    getSubFolderByUserId,
    deleteFolder,
};

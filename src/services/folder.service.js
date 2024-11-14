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

const createSubFolder = async (ownerId, parentId, name, path, options) => {
    const folder = await folderRepository.createSubFolder(
        ownerId,
        parentId,
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
    const folder = await folderRepository.getFolder(id, options);

    return folder;
};

const getFolderByUserId = async (userId, folderId, options) => {
    const folder = await folderRepository.getFolderByUserId(
        userId,
        folderId,
        options
    );

    return folder;
};

const getFolderRelation = async (ownerId, folderId) => {
    const folder = await folderRepository.getFolderRelation(ownerId, folderId);

    return folder;
};

const deleteFolder = async (userId, folderId, cb) => {
    const folder = await folderRepository.deleteFolder(userId, folderId, cb);

    return folder;
};

export default {
    createFolder,
    createSubFolder,
    getRootFolder,
    getFolder,
    getFolderByUserId,
    getFolderRelation,
    deleteFolder,
};

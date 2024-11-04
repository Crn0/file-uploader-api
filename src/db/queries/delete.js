import client from '../client.js';

const user = async (id) => {
    const deleteFiles = client.file.deleteMany({
        where: {
            Folder: {
                ownerId: id,
            },
        },
    });

    const deleteFolders = client.folder.deleteMany({
        where: {
            ownerId: id,
        },
    });

    const deleteOpenIds = client.openId.deleteMany({
        where: {
            userId: id,
        },
    });

    const deleteUser = client.user.delete({
        where: {
            id,
        },
    });

    const transaction = await client.$transaction([
        deleteFiles,
        deleteFolders,
        deleteOpenIds,
        deleteUser,
    ]);

    return transaction;
};

const userFolder = async (id) => {
    const main = await client.folder.findUnique({
        where: {
            id,
        },
        include: {
            folders: {
                select: {
                    id,
                },
            },
        },
    });

    const deleteParentFiles = client.file.deleteMany({
        where: {
            folderId: id,
        },
    });

    const folderIds = main.folders;

    // RECURSIVELY DELETE SUB FOLDERS AND ITS FILES
    folderIds.map(async (childId) =>
        (async (obj) => {
            const sub = await client.folder.findUnique({
                where: {
                    id: obj.id,
                },
                include: {
                    folders: {
                        select: {
                            id: obj.id,
                        },
                    },
                },
            });

            sub.folders?.map?.(async (folderId) => {
                if (folderId) {
                    deleteNestedFolders(folderId);
                }
            });

            const files = client.file.deleteMany({
                where: {
                    folderId: obj.id,
                },
            });

            const folder = client.folder.delete({
                where: {
                    id: obj.id,
                },
            });

            await client.$transaction([files, folder]);
        })(childId)
    );

    const deleteMain = client.folder.delete({
        where: {
            id,
        },
    });

    const transaction = client.$transaction([deleteParentFiles, deleteMain]);
    return transaction;
};

const userFile = async (id) => client.file.delete({ where: { id } });

export default {
    user,
    userFolder,
    userFile,
};

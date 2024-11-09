import client from '../../db/client.js';

const deleteNestedFolder = async (obj) => {
    const parent = await client.folder.findUnique({
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

    parent.folders?.map?.(async (folderId) => {
        if (folderId) {
            deleteNestedFolder(folderId);
        }
    });

    await client.folder.delete({
        where: {
            id: obj.id,
        },
    });
};

export default deleteNestedFolder;

const folders = {
    id: true,
    name: true,
    path: true,
    type: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
    parentId: true,
    folders: true,
};

const files = {
    id: true,
    thumnail: true,
    name: true,
    publicId: true,
    size: true,
    version: true,
    ownerId: true,
    folderId: true,
    createdAt: true,
    updatedAt: true,
    deliveryType: true,
    resourceType: true,
};

export default {
    folders,
    files,
};

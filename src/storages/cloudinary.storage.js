import cloudinary from '../configs/cloudinary/index.js';
import CloudinrayError from '../errors/cloudinary.error.js';

const fileURL = (fileObj, transformations) =>
    cloudinary.url(fileObj.publicId, {
        ...transformations,
    });

const fileDownload = (fileObj) =>
    cloudinary.url(fileObj.publicId, {
        flags: `attachment:${fileObj.name}`,
        resource_type: fileObj.resourceType,
    });

const timeDownload = (fileObj) =>
    cloudinary.utils.private_download_url(fileObj.publicId, fileObj.extension, {
        expires_at: fileObj.expiresAt,
        type: fileObj.deliveryType,
        attachment: true,
    });

const createFolder = async (folderPath) => {
    try {
        const res = await cloudinary.api.create_folder(folderPath);

        return res;
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (typeof e.code === 'string') throw new Error(e.message);

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

const createFile = async (folder, file, type, eagerOptions) => {
    try {
        const res = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: type,
            eager: eagerOptions,
            use_filename: true,
        });

        return res;
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

const getFilesByAssetFolder = async (folderPath) => {
    try {
        const res = await cloudinary.api.resources_by_asset_folder(folderPath);

        return res.resources;
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (typeof e.code === 'string') throw new Error(e.message);

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

const getSubFolders = async (folderPath) => {
    try {
        const { folders } = await cloudinary.api.sub_folders(folderPath);

        return folders;
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (typeof e.code === 'string') throw new Error(e.message);

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

const destroyFile = async (publicId, type) => {
    try {
        const res = await cloudinary.uploader.destroy(publicId, {
            resource_type: type,
            invalidate: true,
        });

        return res;
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (typeof e.code === 'string') throw new Error(e.message);

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

const destroyNestedFiles = async (folderPath) => {
    try {
        const files = await getFilesByAssetFolder(folderPath);

        const subFolders = await getSubFolders(folderPath);

        await Promise.all(
            subFolders?.map?.(async (folder) => {
                await destroyNestedFiles(folder.path);
            })
        );

        return Promise.all(
            files?.map?.(async (file) => {
                await destroyFile(file.public_id, file.resource_type);
            })
        );
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (typeof e.code === 'string') throw new Error(e.message);

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

const destroyFolder = async (folderPath) => {
    try {
        return cloudinary.api.delete_folder(folderPath);
    } catch (e) {
        const { error } = e;

        if (e instanceof CloudinrayError) throw e;

        if (typeof e.code === 'string') throw new Error(e.message);

        if (e.message) {
            throw new CloudinrayError(e.message, e.http_code);
        }

        throw new CloudinrayError(error.message, error.http_code);
    }
};

export default {
    createFolder,
    createFile,
    getSubFolders,
    fileURL,
    fileDownload,
    timeDownload,
    destroyFolder,
    destroyNestedFiles,
    destroyFile,
};

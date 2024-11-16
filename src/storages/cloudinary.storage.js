import cloudinary from '../configs/cloudinary/index.js';
import CloudinrayError from '../errors/cloudinary.error.js';

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

const destroyFolder = async (folderPath) => {
    try {
        const files = await getFilesByAssetFolder(folderPath);

        files.map(async (file) => {
            await destroyFile(file.public_id, file.resource_type);
        });

        const folder = await cloudinary.api.delete_folder(folderPath);

        return folder;
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
    destroyFolder,
    destroyFile,
};

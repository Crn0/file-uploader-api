import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import userService from '../../services/user.service.js';
import folderService from '../../services/folder.service.js';
import storageFactory from '../../storages/index.js';
import FieldError from '../../errors/field.error.js';
import APIError from '../../errors/api.error.js';

const me = asyncHandler(async (req, res, _) => {
    const { user } = req;

    res.json({
        user,
    });
});

const deleteAccount = asyncHandler(async (req, res, _) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorFields = errors.array().map((err) => {
            const { type, msg: message, path: field } = err;

            return {
                type,
                field,
                message,
            };
        });

        throw new FieldError('Validation Failed', errorFields, 422);
    }

    const { user } = req;
    const userId = Number(req.params.userId);

    const userExist = await userService.meById(userId);

    if (!userExist) throw new APIError('User doest not exist', 404);

    if (userExist.id === user.id || user.role === 'admin') {
        const storage = storageFactory().createStorage('cloudinary');

        const rootFolder = await folderService.getRootFolder(userId);

        await storage.destroyNestedFiles(rootFolder.path);

        await storage.destroyFolder(rootFolder.path);

        await userService.deleteUser(userId);

        res.sendStatus(204);
    } else {
        throw new APIError(
            'You do not have the required permissions to delete this account',
            403
        );
    }
});

export default {
    me,
    deleteAccount,
};

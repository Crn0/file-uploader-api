import { Router } from 'express';
import controllers from '../../controllers/file/index.js';
import middlewares from '../../middlewares/index.js';
import validations from '../../validation/index.validation.js';

const router = Router();

const { queryValidation, paramValidation } = validations;

router.use(middlewares.readAcessToken);

router.get(
    '/:fileId',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('get'),
    middlewares.validationError,
    controllers.getFileMetaData
);

router.get(
    '/:fileId/content',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('get'),
    middlewares.validationError,
    controllers.getFileContent
);

router.get(
    '/:fileId/link',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('get:link'),
    middlewares.validationError,
    controllers.generateLink
);

router.get(
    '/:fileId/preview',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('get'),
    middlewares.validationError,
    controllers.previewFile
);

router.post(
    '/',
    middlewares.protectedRoute,
    queryValidation.file('post', 'folderId'),
    middlewares.multerUpload('file'),
    middlewares.validationError,
    controllers.createFile
);

router.delete(
    '/:fileId',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('delete'),
    middlewares.validationError,
    controllers.deleteFile
);

export default router;

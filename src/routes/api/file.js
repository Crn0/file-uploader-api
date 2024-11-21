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
    controllers.getFileMetaData
);

router.get(
    '/:fileId/content',
    // middlewares.protectedRoute,
    // paramValidation.entityId('fileId'),
    // queryValidation.file('get'),
    controllers.getFileContent
);

router.get(
    '/:fileId/link',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('get:link'),
    controllers.generateLink
);

router.get(
    '/:fileId/preview',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('get'),
    controllers.previewFile
);

router.post(
    '/',
    middlewares.protectedRoute,
    queryValidation.file('post', 'folderId'),
    middlewares.multerUpload('file'),
    controllers.createFile
);

router.delete(
    '/:fileId',
    middlewares.protectedRoute,
    paramValidation.entityId('fileId'),
    queryValidation.file('delete'),
    controllers.deleteFile
);

export default router;

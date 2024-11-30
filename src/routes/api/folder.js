import { Router } from 'express';
import controllers from '../../controllers/folder/index.js';
import middlewares from '../../middlewares/index.js';
import validation from '../../validation/index.validation.js';

const { queryValidation, paramValidation, formValidation } = validation;

const router = Router();

router.use(middlewares.readAcessToken);

router.get(
    '/root',
    middlewares.protectedRoute,
    queryValidation.folder('root'),
    controllers.getRootFolder
);

router.get(
    '/:folderId',
    middlewares.protectedRoute,
    paramValidation.entityId('folderId'),
    queryValidation.folder('get'),
    middlewares.queryOptions,
    controllers.getFolder
);

router.get(
    '/:folderId/link',
    middlewares.protectedRoute,
    paramValidation.entityId('folderId'),
    queryValidation.folder('get:link'),
    controllers.generateLink
);

router.post(
    '/:folderId/sub-folder',
    middlewares.protectedRoute,
    paramValidation.entityId('folderId'),
    queryValidation.folder('post'),
    formValidation.resourceEntity,
    controllers.createSubFolder
);

router.delete(
    '/:folderId',
    middlewares.protectedRoute,
    paramValidation.entityId('folderId'),
    queryValidation.folder('delete'),
    controllers.deleteFolder
);

export default router;

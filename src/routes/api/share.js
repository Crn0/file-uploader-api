import { Router } from 'express';
import controllers from '../../controllers/share/index.js';
import middlewares from '../../middlewares/index.js';
import validation from '../../validation/index.validation.js';

const { queryValidation, paramValidation } = validation;

const router = Router();

router.get(
    '/:token',
    paramValidation.token(),
    queryValidation.share('get'),
    middlewares.validationError,
    middlewares.readShareToken,
    middlewares.queryOptions,
    controllers.getFolder,
    controllers.getFileMetaData,
    controllers.previewFile,
    controllers.getFileContent
);

export default router;

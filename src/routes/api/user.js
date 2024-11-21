import { Router } from 'express';
import controllers from '../../controllers/user/index.js';
import middlewares from '../../middlewares/index.js';
import validation from '../../validation/index.validation.js';

const router = Router();

router.use(middlewares.readAcessToken);

router.get(
    '/me',
    middlewares.protectedRoute,
    validation.paramValidation.entityId('userId'),
    controllers.me
);

router.delete(
    '/:userId',
    middlewares.protectedRoute,
    validation.paramValidation.entityId('userId'),
    controllers.deleteAccount
);

export default router;

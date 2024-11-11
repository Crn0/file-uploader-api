import { Router } from 'express';
import controllers from '../../controllers/auth/index.js';
import validations from '../../validation/index.validation.js';
import middlewares from '../../middlewares/index.js';

const route = Router();

const { formValidation } = validations;
const {
    createUserLocal,
    authenticateLocal,
    authenticateGoogle,
    googleCb,
    refresh,
    login,
    logout,
} = controllers;

const { verifyRefreshToken } = middlewares;

route.get('/google', authenticateGoogle);
route.get('/google/callback', googleCb, login);

route.post('/local', formValidation.signUp, createUserLocal, login);
route.post('/tokens', formValidation.login, authenticateLocal, login);
route.post('/tokens/refresh-token', verifyRefreshToken, refresh, login);

route.delete('/tokens', logout);

export default route;

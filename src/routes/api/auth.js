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
    redirectAuth,
    logout,
} = controllers;

const { readRefreshToken } = middlewares;

route.get('/google', authenticateGoogle);
route.get('/google/callback', googleCb, redirectAuth);

route.post('/register', formValidation.signUp, createUserLocal, login);
route.post('/login', formValidation.login, authenticateLocal, login);
route.post('/refresh-token', readRefreshToken, refresh, login);

route.post('/logout', logout);

export default route;

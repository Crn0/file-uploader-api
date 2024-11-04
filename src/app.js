import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import logger from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import passportStrategies from './configs/passportStrategies/index.js';
import ErrorHandler from './helpers/errors/errorHandler.js';

const app = express();
// eslint-disable-next-line no-underscore-dangle
const __dirname =
    import.meta.dirname || dirname(fileURLToPath(import.meta.url));

passport.use(passportStrategies.local);
passport.use(passportStrategies.google);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // Compress all routes
app.use(express.static(join(__dirname, '..', 'public')));

// ROUTES

// error handler
app.use((err, req, res, _) => {
    if (!ErrorHandler.isTrustedError(err)) {
        process.exit(1);
    } else {
        ErrorHandler.handleError(err, res);
    }
});

export default app;

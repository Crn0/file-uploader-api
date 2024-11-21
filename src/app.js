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
import corsOptions from './configs/cors/index.js';
import passportStrategy from './configs/passportStrategies/index.js';
import apiRoutes from './routes/api/index.js';
import ErrorHandler from './errors/error.handler.js';

const app = express();
// eslint-disable-next-line no-underscore-dangle
const __dirname =
    import.meta.dirname || dirname(fileURLToPath(import.meta.url));

passport.use(passportStrategy.local);
passport.use(passportStrategy.google);

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression()); // Compress all routes
app.use(express.static(join(__dirname, '..', 'public')));

// ROUTES
app.use('/api/v1/auth', apiRoutes.auth);
app.use('/api/v1/folders', apiRoutes.folder);
app.use('/api/v1/files', apiRoutes.file);
app.use('/api/v1/users', apiRoutes.user);

// error handler
app.use((err, req, res, _) => {
    if (!ErrorHandler.isTrustedError(err)) {
        console.log(err);
        process.exit(1);
    } else {
        ErrorHandler.handleError(err, res);
    }
});

export default app;

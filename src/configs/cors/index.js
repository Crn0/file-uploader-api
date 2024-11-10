import 'dotenv/config';

const corsOptions = {
    origin: process.env.CORS_ORIGINS.split(','),
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200,
};

export default corsOptions;

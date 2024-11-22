import 'dotenv/config';

const corsOptions = {
    origin: process.env.CORS_ORIGINS.split(','),
    methods: process.env.CORS_METHODS.split(','),
    optionsSuccessStatus: 200,
};

export default corsOptions;

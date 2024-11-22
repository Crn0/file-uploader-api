import cloudinary from './cloudinary.storage.js';

function Storage() {
    return {
        createStorage: (type) => {
            if (type === 'cloudinary') return cloudinary;

            return cloudinary;
        },
    };
}

export default Storage;

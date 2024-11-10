import userRepository from '../repository/user.repository.js';

const clean = (obj, keysToRemove) => {
    if (!Array.isArray(keysToRemove)) {
        throw new Error(
            `keysToRemove is type of ${typeof keysToRemove}; expected an type of array`
        );
    }

    const objArr = Object.entries(obj).filter(
        ([value, _]) => !keysToRemove.includes(value)
    );

    return Object.fromEntries(objArr);
};

const objectsStringifyValue = (arrObj, valueToString) => {
    const clone = [...arrObj];

    return clone.map((obj) => ({
        ...obj,
        [valueToString]: String(obj[valueToString]),
    }));
};

const me = async (id) => {
    const user = await userRepository.getUserById(id);

    return user;
};

const updateUsername = async (id, newUsername, options) => {
    const patchedUser = await userRepository.patchUsername(
        id,
        newUsername,
        options
    );

    return patchedUser;
};

const updatePassword = async (id, password, options) => {
    const patchedPassword = await userRepository.patchPassword(
        id,
        password,
        options
    );

    return patchedPassword;
};

const deleteUser = async (id, storage) => {
    const userResources = await userRepository.getUserRecources(id);

    const deletedUser = await userRepository.deleteUser(id);

    userResources.folders.map(async (folder) =>
        storage.deleteFolder(folder.path)
    );
    userResources.files.map(async (file) => storage.deleteFile(file.publicId));

    return deletedUser;
};

export default {
    clean,
    objectsStringifyValue,
    me,
    updateUsername,
    updatePassword,
    deleteUser,
};

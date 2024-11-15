import APIError from '../../errors/api.error.js';

const optionIncludes = (queryObject, validkeys) => {
    let keys;
    const options = {};
    const queryString = queryObject.includes;

    if (!queryString) return options;

    if (queryString.includes(',')) {
        keys = queryString.split(',');
        keys.forEach((key) => {
            if (key.includes('.')) {
                const keyWithField = key.trim().split('.');

                const parentKey = keyWithField[0];
                const childKey = keyWithField[1];
                if (!validkeys[parentKey])
                    throw new APIError(`Invalid ${parentKey} field`, 403);

                if (!validkeys[parentKey][childKey])
                    throw new APIError(`Invalid ${childKey} field`, 403);

                if (!options[parentKey]) {
                    options[parentKey] = {
                        select: {},
                    };
                }

                options[parentKey].select[childKey] = true;
            } else {
                const trimKey = key.trim();
                options[trimKey] = true;
            }
        });
        return options;
    }

    keys = queryString.trim();

    if (keys.includes('.')) {
        const keyWithField = keys.trim().split('.');
        const parentKey = keyWithField[0];
        const childKey = keyWithField[1];

        if (!validkeys[parentKey])
            throw new APIError(`Invalid ${parentKey} field`, 403);

        if (!validkeys[parentKey][childKey])
            throw new APIError(`Invalid ${childKey} field`, 403);

        options[parentKey] = {
            select: {},
        };

        options[parentKey].select[childKey] = true;
    } else {
        const trimKey = keys.trim();

        if (!validkeys[trimKey])
            throw new APIError(`Invalid ${trimKey} field`, 403);

        options[trimKey] = true;
    }

    return options;
};

export default optionIncludes;

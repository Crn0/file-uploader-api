const optionFn = (options, obj) => {
    let ops = { ...options };

    if (typeof options !== 'object') {
        ops = {
            ...obj,
        };
    }

    return ops;
};

export default optionFn;

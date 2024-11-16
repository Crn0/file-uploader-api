const pagination = ({ limit, offset }) => {
    const take = Number(limit) || 5;
    const skip = Number(offset) || 0;

    return {
        take,
        skip,
    };
};

export default pagination;

import { PrismaClient } from '@prisma/client';
import cloudinary from '../configs/cloudinary/index.js';

const prisma = new PrismaClient();

async function main() {
    const { resources } = await cloudinary.api.resources_by_ids(
        'Test/yae516krkls0lmkemauj'
    );
    console.log(resources);
    const [testUser, testOpenId] = await prisma.$transaction([
        prisma.user.create({
            data: {
                username: 'John Doe',
                email: 'john@gmail.com',
                password: 'test',
                folders: {
                    create: [
                        {
                            name: 'Test',
                            path: 'Test',
                            files: {
                                create: {
                                    name: 'cat.png',
                                    url: resources[0].url,
                                    size: resources[0].bytes,
                                    resourceType: resources[0].format,
                                    deliveryType: resources[0].type,
                                    publicId: resources[0].public_id,
                                    owner: {
                                        connect: {
                                            username: 'John Doe',
                                        },
                                    },
                                },
                            },
                            folders: {
                                create: [
                                    {
                                        name: 'Nested_Test',
                                        path: '/Test/Nested_Test',
                                        ownerId: 1,
                                        folders: {
                                            create: [
                                                {
                                                    name: 'Nested_Nested_Test01',
                                                    path: '/Test/Nested_Test/Nested_Nested_Test01',
                                                    ownerId: 1,
                                                    folders: {
                                                        create: [
                                                            {
                                                                name: 'Nested_Nested_Test02',
                                                                path: '/Test/Nested_Test/Nested_Nested_Test02',
                                                                ownerId: 1,
                                                                folders: {
                                                                    create: {
                                                                        name: 'Nested_Nested_Nested_Test01',
                                                                        path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01',
                                                                        ownerId: 1,
                                                                        folders:
                                                                            {
                                                                                create: {
                                                                                    name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                    path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                    ownerId: 1,
                                                                                    folders:
                                                                                        {
                                                                                            create: {
                                                                                                name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                                path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                                ownerId: 1,
                                                                                                folders:
                                                                                                    {
                                                                                                        create: {
                                                                                                            name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                                            path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                                            ownerId: 1,
                                                                                                            files: {
                                                                                                                create: [
                                                                                                                    {
                                                                                                                        name: 'cat.png',
                                                                                                                        url: resources[0]
                                                                                                                            .url,
                                                                                                                        size: resources[0]
                                                                                                                            .bytes,
                                                                                                                        resourceType:
                                                                                                                            resources[0]
                                                                                                                                .format,
                                                                                                                        deliveryType:
                                                                                                                            resources[0]
                                                                                                                                .type,
                                                                                                                        publicId:
                                                                                                                            resources[0]
                                                                                                                                .public_id,
                                                                                                                        owner: {
                                                                                                                            connect:
                                                                                                                                {
                                                                                                                                    username:
                                                                                                                                        'John Doe',
                                                                                                                                },
                                                                                                                        },
                                                                                                                    },
                                                                                                                    {
                                                                                                                        name: 'cat.png',
                                                                                                                        url: resources[0]
                                                                                                                            .url,
                                                                                                                        size: resources[0]
                                                                                                                            .bytes,
                                                                                                                        resourceType:
                                                                                                                            resources[0]
                                                                                                                                .format,
                                                                                                                        deliveryType:
                                                                                                                            resources[0]
                                                                                                                                .type,
                                                                                                                        publicId:
                                                                                                                            resources[0]
                                                                                                                                .public_id,
                                                                                                                        owner: {
                                                                                                                            connect:
                                                                                                                                {
                                                                                                                                    username:
                                                                                                                                        'John Doe',
                                                                                                                                },
                                                                                                                        },
                                                                                                                    },
                                                                                                                ],
                                                                                                            },
                                                                                                        },
                                                                                                    },
                                                                                            },
                                                                                        },
                                                                                },
                                                                            },
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                name: 'Nested_Nested_Test02',
                                                                path: '/Test/Nested_Test/Nested_Nested_Test02',
                                                                ownerId: 1,
                                                                folders: {
                                                                    create: {
                                                                        name: 'Nested_Nested_Nested_Test01',
                                                                        path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01',
                                                                        ownerId: 1,
                                                                        folders:
                                                                            {
                                                                                create: {
                                                                                    name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                    path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                    ownerId: 1,
                                                                                    folders:
                                                                                        {
                                                                                            create: {
                                                                                                name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                                path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                                ownerId: 1,
                                                                                                folders:
                                                                                                    {
                                                                                                        create: {
                                                                                                            name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                                            path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                                            ownerId: 1,
                                                                                                            files: {
                                                                                                                create: [
                                                                                                                    {
                                                                                                                        name: 'cat.png',
                                                                                                                        url: resources[0]
                                                                                                                            .url,
                                                                                                                        size: resources[0]
                                                                                                                            .bytes,
                                                                                                                        resourceType:
                                                                                                                            resources[0]
                                                                                                                                .format,
                                                                                                                        deliveryType:
                                                                                                                            resources[0]
                                                                                                                                .type,
                                                                                                                        publicId:
                                                                                                                            resources[0]
                                                                                                                                .public_id,
                                                                                                                        owner: {
                                                                                                                            connect:
                                                                                                                                {
                                                                                                                                    username:
                                                                                                                                        'John Doe',
                                                                                                                                },
                                                                                                                        },
                                                                                                                    },
                                                                                                                    {
                                                                                                                        name: 'cat.png',
                                                                                                                        url: resources[0]
                                                                                                                            .url,
                                                                                                                        size: resources[0]
                                                                                                                            .bytes,
                                                                                                                        resourceType:
                                                                                                                            resources[0]
                                                                                                                                .format,
                                                                                                                        deliveryType:
                                                                                                                            resources[0]
                                                                                                                                .type,
                                                                                                                        publicId:
                                                                                                                            resources[0]
                                                                                                                                .public_id,
                                                                                                                        owner: {
                                                                                                                            connect:
                                                                                                                                {
                                                                                                                                    username:
                                                                                                                                        'John Doe',
                                                                                                                                },
                                                                                                                        },
                                                                                                                    },
                                                                                                                ],
                                                                                                            },
                                                                                                        },
                                                                                                    },
                                                                                            },
                                                                                        },
                                                                                },
                                                                            },
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    name: 'Nested_Nested_Test02',
                                                    path: '/Test/Nested_Test/Nested_Nested_Test02',
                                                    ownerId: 1,
                                                    folders: {
                                                        create: {
                                                            name: 'Nested_Nested_Nested_Test01',
                                                            path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01',
                                                            ownerId: 1,
                                                            folders: {
                                                                create: {
                                                                    name: 'Nested_Nested_Nested_Nested_Test01',
                                                                    path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                    ownerId: 1,
                                                                    folders: {
                                                                        create: {
                                                                            name: 'Nested_Nested_Nested_Nested_Test01',
                                                                            path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                            ownerId: 1,
                                                                            folders:
                                                                                {
                                                                                    create: {
                                                                                        name: 'Nested_Nested_Nested_Nested_Test01',
                                                                                        path: '/Test/Nested_Nested_Test02/Nested_Nested_Nested_Test01/Nested_Nested_Nested_Nested_Test01',
                                                                                        ownerId: 1,
                                                                                        files: {
                                                                                            create: [
                                                                                                {
                                                                                                    name: 'cat.png',
                                                                                                    url: resources[0]
                                                                                                        .url,
                                                                                                    size: resources[0]
                                                                                                        .bytes,
                                                                                                    resourceType:
                                                                                                        resources[0]
                                                                                                            .format,
                                                                                                    deliveryType:
                                                                                                        resources[0]
                                                                                                            .type,
                                                                                                    publicId:
                                                                                                        resources[0]
                                                                                                            .public_id,
                                                                                                    owner: {
                                                                                                        connect:
                                                                                                            {
                                                                                                                username:
                                                                                                                    'John Doe',
                                                                                                            },
                                                                                                    },
                                                                                                },
                                                                                                {
                                                                                                    name: 'cat.png',
                                                                                                    url: resources[0]
                                                                                                        .url,
                                                                                                    size: resources[0]
                                                                                                        .bytes,
                                                                                                    resourceType:
                                                                                                        resources[0]
                                                                                                            .format,
                                                                                                    deliveryType:
                                                                                                        resources[0]
                                                                                                            .type,
                                                                                                    publicId:
                                                                                                        resources[0]
                                                                                                            .public_id,
                                                                                                    owner: {
                                                                                                        connect:
                                                                                                            {
                                                                                                                username:
                                                                                                                    'John Doe',
                                                                                                            },
                                                                                                    },
                                                                                                },
                                                                                            ],
                                                                                        },
                                                                                    },
                                                                                },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        files: {
                                            create: [
                                                {
                                                    name: 'cat.png',
                                                    url: resources[0].url,
                                                    size: resources[0].bytes,
                                                    resourceType:
                                                        resources[0].format,
                                                    deliveryType:
                                                        resources[0].type,
                                                    publicId:
                                                        resources[0].public_id,
                                                    owner: {
                                                        connect: {
                                                            username:
                                                                'John Doe',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            include: {
                folders: {
                    include: {
                        files: true,
                        folders: true,
                    },
                },
            },
        }),
        prisma.openId.create({
            data: {
                provider: 'google',
                tokenId: '1234',
                user: {
                    connectOrCreate: {
                        where: {
                            id: 2,
                        },
                        create: {
                            username: 'Jane Doe',
                        },
                    },
                },
            },
            include: {
                user: true,
            },
        }),
    ]);

    console.log(testUser);
    console.log(testOpenId);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

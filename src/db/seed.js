import { PrismaClient } from '@prisma/client';
import cloudinary from '../configs/cloudinary/index.js';

const prisma = new PrismaClient();

async function main() {
    const { resources } = await cloudinary.api.resources_by_ids(
        'Test/yae516krkls0lmkemauj'
    );

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
                                    format: resources[0].format,
                                    publicId: resources[0].public_id,
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
                                                    name: 'Nested_Nested_Test',
                                                    path: '/Test/Nested_Test/Nested_Nested_Test',
                                                    ownerId: 1,
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        name: 'Nested_Nested_Test02',
                                        path: '/Test/Nested_Test/Nested_Nested_Test02',
                                        ownerId: 1,
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
                            email: 'Jane@test.com',
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

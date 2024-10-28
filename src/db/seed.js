import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const testUser = await prisma.user.create({
        data: {
            username: 'Test User',
            email: 'test@gmail.com',
            password: 'test',
            folders: {
                create: [
                    {
                        name: 'Test',
                        path: 'Test',    
                        files: {
                            create: {
                                name: 'cat.png',
                                url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1730101425/Test/yae516krkls0lmkemauj.jpg',
                                publicId: 'Test/yae516krkls0lmkemauj',
                            }
                        }, 
                        folders: {
                            create: [
                                {
                                    name: 'Nested Test',
                                    path: 'Nested Test',
                                    ownerId: 1,
                                }
                            ]
                        }
                    },
                ],
                
            }
        },
        include: {
            folders: {
                include: {
                    files: true,
                    folders: true
                }
            },
        }
    });

    console.log(testUser)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
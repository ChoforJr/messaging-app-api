import prisma from "../config/prisma.js";

export async function createUser(username, password, displayName) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          displayName: displayName,
        },
      },
    },
  });
}

export async function insertFiles(data) {
  await prisma.files.createMany({
    data,
    skipDuplicates: true,
  });
}

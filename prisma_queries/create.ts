import prisma from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

export async function createGuest(
  username: string,
  password: string,
  displayName: string,
  bio: string,
) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          displayName: displayName,
          bio: bio,
          type: "guest",
        },
      },
    },
  });
}

export async function createOtherUser(
  username: string,
  password: string,
  displayName: string,
  bio: string,
) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          displayName: displayName,
          bio: bio,
        },
      },
    },
  });
}

export async function createUser(
  username: string,
  password: string,
  displayName: string,
) {
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

export async function insertFiles(data: Prisma.FilesCreateManyInput[]) {
  await prisma.files.createMany({
    data,
    skipDuplicates: true,
  });
}

export async function createTextOnlyMessage(
  authorID: number,
  content: string,
  toUserID: number | null,
  toGroupID: number | null,
) {
  const message = await prisma.message.create({
    data: {
      content: content,
      authorId: authorID,
      toUserId: toUserID,
      toGroupId: toGroupID,
    },
  });
  return message;
}

export async function createGroup(
  adminID: number,
  name: string,
  description: string,
) {
  const message = await prisma.group.create({
    data: {
      name: name,
      description: description,
      adminId: adminID,
      members: {
        connect: [
          {
            id: adminID,
          },
        ],
      },
    },
  });
  return message;
}

export async function createImageOnlyMessage(
  authorID: number,
  toUserID: number | null,
  toGroupID: number | null,
  data: Prisma.FilesCreateManyInput[],
) {
  const message = await prisma.message.create({
    data: {
      authorId: authorID,
      toUserId: toUserID,
      toGroupId: toGroupID,
      Files: {
        createMany: {
          data,
          skipDuplicates: true,
        },
      },
    },
    include: {
      Files: true,
    },
  });
  return message;
}

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

export async function createTextOnlyMessage(
  authorID,
  content,
  toUserID,
  toGroupID,
) {
  const message = await prisma.message.createManyAndReturn({
    data: {
      content: content,
      authorId: authorID,
      toUserId: toUserID,
      toGroupId: toGroupID,
    },
  });
  return message;
}

export async function createGroup(adminID, name, description) {
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

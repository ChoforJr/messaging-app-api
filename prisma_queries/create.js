import prisma from "../config/prisma.js";

export async function createGuest(username, password, displayName, bio) {
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

export async function createOtherUser(username, password, displayName, bio) {
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

export async function createImageOnlyMessage(
  authorID,
  toUserID,
  toGroupID,
  data,
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

import prisma from "../config/prisma.js";

export async function findUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
  });
  return user;
}

export async function findUserByID(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
      profile: true,
    },
  });
  return user;
}

export async function findProfileByUserID(userID) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
  });
  return profile;
}

export async function findProfiles() {
  const profiles = await prisma.profile.findMany({
    include: {
      photo: true,
    },
  });
  return profiles;
}

export async function findAllGroups() {
  const groups = await prisma.group.findMany({
    include: {
      members: true,
      profilePhoto: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  return groups;
}

export async function findAllMemberGroups(userID) {
  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          id: userID,
        },
      },
    },
    include: {
      members: true,
      profilePhoto: true,
      message: {
        include: {
          author: {
            select: {
              profile: true,
            },
          },
          Files: {
            orderBy: {
              id: "desc",
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  });
  return groups;
}

export async function findGroupByID(groupID) {
  const groups = await prisma.group.findUnique({
    where: {
      id: groupID,
    },
  });
  return groups;
}

export async function findMessagesToUser(userID) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ authorId: userID }, { toUserId: userID }],
      toGroupId: null,
    },
    include: {
      Files: {
        orderBy: {
          id: "desc",
        },
      },
      toUser: {
        select: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
}

export async function findRecentMessagesToUser(userID, recentDate) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ authorId: userID }, { toUserId: userID }],
      toGroupId: null,
      createdAt: {
        gt: recentDate,
      },
    },
    include: {
      Files: {
        orderBy: {
          id: "desc",
        },
      },
      toUser: {
        select: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
}

export async function findRecentMessagesToGroups(userID, recentDate) {
  const messages = await prisma.message.findMany({
    where: {
      authorId: userID,
      toUserId: null,
      createdAt: {
        gt: recentDate,
      },
    },
    include: {
      Files: {
        orderBy: {
          id: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
}

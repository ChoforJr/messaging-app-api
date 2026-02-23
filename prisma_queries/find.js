import prisma from "../config/prisma.js";

export async function findGuest() {
  const profile = await prisma.profile.findMany({
    where: { type: "guest" },
    orderBy: {
      id: "desc",
    },
  });
  return profile;
}

export async function findUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      profile: true,
    },
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
      profile: {
        include: {
          photo: true,
        },
      },
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

export async function findFollowings(userID) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
    select: {
      following: {
        include: {
          photo: true,
        },
      },
    },
  });
  return profile;
}

export async function findFriends(profileID) {
  const profiles = await prisma.profile.findMany({
    where: {
      AND: [
        {
          id: { not: profileID },
        },
        {
          followedBy: {
            none: { id: profileID },
          },
        },
      ],
    },
    include: {
      photo: true,
    },
  });
  return profiles;
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

export async function findAllMemberGroups(profileID) {
  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          id: profileID,
        },
      },
    },
    include: {
      members: true,
      profilePhoto: true,
    },
  });
  return groups;
}

export async function findAllNonMemberGroups(profileID) {
  const groups = await prisma.group.findMany({
    where: {
      members: {
        none: {
          id: profileID,
        },
      },
    },
    include: {
      members: true,
      profilePhoto: true,
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
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return messages;
}

export async function findMessagesToGroups(profileID) {
  const messages = await prisma.message.findMany({
    where: {
      toUserId: null,
      toGroupId: {
        in: (await findAllMemberGroups(profileID)).map((group) => group.id),
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
      createdAt: "asc",
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return messages;
}

export async function findRecentMessagesToGroups(profileID, recentDate) {
  const messages = await prisma.message.findMany({
    where: {
      toUserId: null,
      toGroupId: {
        in: (await findAllMemberGroups(profileID)).map((group) => group.id),
      },
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

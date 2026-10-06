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

export async function findUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      profile: true,
    },
  });
  return user;
}

export async function findUserByID(userId: number) {
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

export async function findProfileByUserID(userID: number) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
  });
  return profile;
}

export async function findFollowings(userID: number) {
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

export async function findFriends(profileID: number) {
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

export async function findAllMemberGroups(profileID: number) {
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

export async function findAllNonMemberGroups(profileID: number) {
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

export async function findGroupByID(groupID: number) {
  const groups = await prisma.group.findUnique({
    where: {
      id: groupID,
    },
  });
  return groups;
}

export interface MessageCursor {
  createdAt: Date;
  id: number;
}

export async function findMessagesToUser(
  userID: number,
  before?: MessageCursor,
) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ authorId: userID }, { toUserId: userID }],
      toGroupId: null,
      ...(before
        ? {
            AND: [
              {
                OR: [
                  { createdAt: { lt: before.createdAt } },
                  { createdAt: before.createdAt, id: { lt: before.id } },
                ],
              },
            ],
          }
        : {}),
    },
    include: {
      Files: {
        select: {
          id: true,
          originalName: true,
          size: true,
          url: true,
        },
        orderBy: {
          id: "desc",
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 100,
  });
  return messages;
}

async function findMemberGroupIds(profileID: number) {
  const groups = await prisma.group.findMany({
    where: { members: { some: { id: profileID } } },
    select: { id: true },
  });
  return groups.map((group) => group.id);
}

export async function findMessagesToGroups(
  profileID: number,
  before?: MessageCursor,
) {
  const groupIds = await findMemberGroupIds(profileID);
  if (groupIds.length === 0) return [];

  const messages = await prisma.message.findMany({
    where: {
      toUserId: null,
      toGroupId: { in: groupIds },
      ...(before
        ? {
            AND: [
              {
                OR: [
                  { createdAt: { lt: before.createdAt } },
                  { createdAt: before.createdAt, id: { lt: before.id } },
                ],
              },
            ],
          }
        : {}),
    },
    include: {
      Files: {
        select: {
          id: true,
          originalName: true,
          size: true,
          url: true,
        },
        orderBy: {
          id: "desc",
        },
      },
      author: {
        select: {
          profile: {
            select: {
              displayName: true,
              photo: { select: { url: true } },
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 100,
  });
  return messages;
}

export async function findRecentMessagesToUser(userID: number, recentDate: Date) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ authorId: userID }, { toUserId: userID }],
      toGroupId: null,
      createdAt: { gte: recentDate },
    },
    include: {
      Files: {
        select: {
          id: true,
          originalName: true,
          size: true,
          url: true,
        },
        orderBy: {
          id: "desc",
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  return messages;
}

export async function findRecentMessagesToGroups(
  profileID: number,
  recentDate: Date,
) {
  const messages = await prisma.message.findMany({
    where: {
      toUserId: null,
      toGroupId: { in: await findMemberGroupIds(profileID) },
      createdAt: { gte: recentDate },
    },
    include: {
      Files: {
        select: {
          id: true,
          originalName: true,
          size: true,
          url: true,
        },
        orderBy: {
          id: "desc",
        },
      },
      author: {
        select: {
          profile: {
            select: {
              displayName: true,
              photo: { select: { url: true } },
            },
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  return messages;
}

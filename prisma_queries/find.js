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
      message: true,
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

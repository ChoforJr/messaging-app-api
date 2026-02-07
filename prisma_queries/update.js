import prisma from "../config/prisma.js";

export async function updateBio(userId, newBio) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      bio: newBio,
    },
  });
}

export async function updateDisplayName(userId, newDisplayName) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      displayName: newDisplayName,
    },
  });
}

export async function updateUsername(userId, newUsername) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUsername,
    },
  });
}

export async function updatePassword(userId, newPassword) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
}

export async function updateGroupInfo(groupId, column, colContent) {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      [column]: colContent,
    },
  });
}

export async function updateGroupAdmin(groupId, newAdminID) {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      admin: {
        connect: { id: newAdminID },
      },
    },
  });
}

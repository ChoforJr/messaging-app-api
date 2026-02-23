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

export async function joinGroup(groupId, profileID) {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        connect: { id: profileID },
      },
    },
  });
}

export async function leaveGroup(groupId, profileID) {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        disconnect: { id: profileID },
      },
    },
  });
}

export async function adminRemoveMember(groupId, adminID, userId) {
  return await prisma.$transaction(async (tx) => {
    const group1 = await tx.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group1) {
      return null;
    }

    if (group1.adminId !== adminID) {
      return "Not Admin";
    }

    await tx.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  });
}

export async function adminAddMember(groupId, adminID, userId) {
  return await prisma.$transaction(async (tx) => {
    const group1 = await tx.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group1) {
      return null;
    }

    if (group1.adminId !== adminID) {
      return "Not Admin";
    }

    await tx.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  });
}

export async function addConnect(profileID, contactId) {
  await prisma.profile.update({
    where: {
      id: profileID,
    },
    data: {
      followedBy: {
        connect: { id: contactId },
      },
      following: {
        connect: { id: contactId },
      },
    },
  });
}

export async function removeConnect(profileID, contactId) {
  await prisma.profile.update({
    where: {
      id: profileID,
    },
    data: {
      followedBy: {
        disconnect: { id: contactId },
      },
      following: {
        disconnect: { id: contactId },
      },
    },
  });
}

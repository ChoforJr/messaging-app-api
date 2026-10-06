import prisma from "../config/prisma.js";

export async function updateBio(userId: number, newBio: string) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      bio: newBio,
    },
  });
}

export async function updateDisplayName(
  userId: number,
  newDisplayName: string,
) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      displayName: newDisplayName,
    },
  });
}

export async function updateUsername(userId: number, newUsername: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUsername,
    },
  });
}

export async function updatePassword(userId: number, newPassword: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
}

export async function updateGroupInfo(
  groupId: number,
  column: "name" | "description",
  colContent: string,
) {
  await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      [column]: colContent,
    },
  });
}

export async function updateGroupAdmin(groupId: number, newAdminID: number) {
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

export async function joinGroup(groupId: number, profileID: number) {
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

export async function leaveGroup(groupId: number, profileID: number) {
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

export async function adminRemoveMember(
  groupId: number,
  adminID: number,
  userId: number,
) {
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

export async function adminAddMember(
  groupId: number,
  adminID: number,
  userId: number,
) {
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

export async function addConnect(profileID: number, contactId: number) {
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

export async function removeConnect(profileID: number, contactId: number) {
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

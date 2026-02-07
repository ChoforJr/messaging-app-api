import prisma from "../config/prisma.js";

export async function deleteUserByID(userID) {
  return await prisma.$transaction(async (tx) => {
    const file = await tx.files.findUnique({
      where: { ProfileId: userID },
    });

    await tx.user.delete({
      where: {
        id: userID,
      },
    });

    return file;
  });
}

export async function deleteProfilePhoto(fileID, userID) {
  return await prisma.$transaction(async (tx) => {
    const file = await tx.files.findUnique({
      where: { id: fileID },
    });

    if (!file) {
      return null;
    }

    if (file.ProfileId !== userID) {
      return "wrong user";
    }

    await tx.files.delete({
      where: {
        id: fileID,
      },
    });

    return file;
  });
}

export async function deleteGroupPhoto(fileID, userID) {
  return await prisma.$transaction(async (tx) => {
    const file = await tx.files.findUnique({
      where: { id: fileID },
    });

    if (!file) {
      return null;
    }

    const group = await tx.group.findUnique({
      where: {
        id: file.groupId,
        adminId: userID,
      },
    });
    if (!group) {
      return "Not Admin";
    }

    await tx.files.delete({
      where: {
        id: fileID,
      },
    });

    return file;
  });
}

export async function deleteGroupByID(groupID, userID) {
  return await prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: {
        id: groupID,
      },
    });
    if (!group) {
      return null;
    }
    if (group.adminId !== userID) {
      return "Not Admin";
    }

    const file = await tx.files.findUnique({
      where: { groupId: groupID },
    });

    await tx.group.delete({
      where: {
        id: groupID,
      },
    });

    return file;
  });
}

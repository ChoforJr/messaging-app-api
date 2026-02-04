import prisma from "../config/prisma.js";

export async function deleteUserByID(userID) {
  return await prisma.$transaction(async (tx) => {
    const file = await tx.files.findUnique({
      where: { ProfileId: userID },
    });

    await prisma.user.delete({
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

    await prisma.files.delete({
      where: {
        id: fileID,
      },
    });

    return file;
  });
}

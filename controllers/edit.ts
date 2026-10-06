import {
  updateUsername,
  updatePassword,
  updateDisplayName,
  updateBio,
  updateGroupInfo,
  updateGroupAdmin,
  joinGroup,
  leaveGroup,
  adminRemoveMember,
  adminAddMember,
  addConnect,
  removeConnect,
} from "../prisma_queries/update.js";
import { findGroupByID, findProfileByUserID } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";
import type { NextFunction, Request, Response } from "express";

export async function editUserName(req: Request, res: Response, next: NextFunction) {
  try {
    const checkGuest = await findProfileByUserID(req.user!.id);
    if (!checkGuest) {
      return res.status(404).json("Profile not found");
    }
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newUsername } = matchedData(req);
    const usernameLowerCase = newUsername.toLowerCase();
    await updateUsername(req.user!.id, usernameLowerCase);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const checkGuest = await findProfileByUserID(req.user!.id);
    if (!checkGuest) {
      return res.status(404).json("Profile not found");
    }
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newPassword } = matchedData(req);
    const hashedPassword = await hash(newPassword, 10);
    await updatePassword(req.user!.id, hashedPassword);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editDisplayName(req: Request, res: Response, next: NextFunction) {
  try {
    const checkGuest = await findProfileByUserID(req.user!.id);
    if (!checkGuest) {
      return res.status(404).json("Profile not found");
    }
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newDisplayName } = matchedData(req);
    await updateDisplayName(req.user!.id, newDisplayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editBio(req: Request, res: Response, next: NextFunction) {
  try {
    const checkGuest = await findProfileByUserID(req.user!.id);
    if (!checkGuest) {
      return res.status(404).json("Profile not found");
    }
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newBio } = matchedData(req);
    await updateBio(req.user!.id, newBio);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editGroupName(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = matchedData(req);
    const group = await findGroupByID(Number(req.params.groupId));
    if (!group) {
      return res.status(404).json("Group Not found.");
    }
    if (group.adminId !== req.user!.profileID) {
      return res.status(404).json("You are not authorized to do this.");
    }
    await updateGroupInfo(Number(req.params.groupId), "name", name);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editGroupDescription(req: Request, res: Response, next: NextFunction) {
  try {
    const { description } = matchedData(req);
    const group = await findGroupByID(Number(req.params.groupId));
    if (!group) {
      return res.status(404).json("Group Not found.");
    }
    if (group.adminId !== req.user!.profileID) {
      return res.status(404).json("You are not authorized to do this.");
    }
    await updateGroupInfo(
      Number(req.params.groupId),
      "description",
      description,
    );
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editGroupAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { newAdminID } = matchedData(req);
    const group = await findGroupByID(Number(req.params.groupId));
    if (!group) {
      return res.status(404).json("Group Not found.");
    }
    if (group.adminId !== req.user!.profileID) {
      return res.status(404).json("You are not authorized to do this.");
    }
    await updateGroupAdmin(Number(req.params.groupId), Number(newAdminID));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editGroupJoin(req: Request, res: Response, next: NextFunction) {
  try {
    await joinGroup(Number(req.params.groupId), Number(req.user!.profileID));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editGroupLeave(req: Request, res: Response, next: NextFunction) {
  try {
    await leaveGroup(Number(req.params.groupId), Number(req.user!.profileID));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editGroupDropMember(req: Request, res: Response, next: NextFunction) {
  try {
    const group = await adminRemoveMember(
      Number(req.params.groupID),
      req.user!.profileID,
      Number(req.params.userID),
    );
    if (group === undefined) {
      return res.status(200).json("Done");
    }
    if (group === null) {
      return res.status(200).json("Group Not found");
    }
    if (group === "Not Admin") {
      return res
        .status(404)
        .json("You are not authorized to remove members from this Group");
    }
  } catch (err) {
    return next(err);
  }
}

export async function editGroupAddMember(req: Request, res: Response, next: NextFunction) {
  try {
    const group = await adminAddMember(
      Number(req.params.groupID),
      req.user!.profileID,
      Number(req.params.userID),
    );
    if (group === null) {
      return res.status(200).json("Group Not found");
    }
    if (group === undefined) {
      return res.status(200).json("Done");
    }
    if (group === "Not Admin") {
      return res
        .status(404)
        .json("You are not authorized to add members from this Group");
    }
  } catch (err) {
    return next(err);
  }
}

export async function editConnect(req: Request, res: Response, next: NextFunction) {
  try {
    const { contactId } = matchedData(req);
    await addConnect(Number(req.user!.profileID), Number(contactId));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editDisconnect(req: Request, res: Response, next: NextFunction) {
  try {
    const { contactId } = matchedData(req);
    await removeConnect(Number(req.user!.profileID), Number(contactId));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

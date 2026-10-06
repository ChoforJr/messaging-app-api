import {
  findUserByID,
  findProfileByUserID,
  findProfiles,
  findAllGroups,
  findAllMemberGroups,
  findMessagesToUser,
  findRecentMessagesToUser,
  findRecentMessagesToGroups,
  findMessagesToGroups,
  findAllNonMemberGroups,
  findFollowings,
  findFriends,
} from "../prisma_queries/find.js";
import type { MessageCursor } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import type { NextFunction, Request, Response } from "express";

export async function readUserByID(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserByID(req.user!.id);
    if (!user) {
      return res.json({
        error: "This user doesn't exist",
      });
    }
    res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function readProfileByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await findProfileByUserID(Number(req.params.id));
    if (!profile) {
      return res.json({
        error: "This user doesn't exist",
      });
    }
    res.json(profile);
  } catch (err) {
    return next(err);
  }
}

export async function readFollowings(req: Request, res: Response, next: NextFunction) {
  try {
    const followings = await findFollowings(req.user!.id);
    res.json(followings);
  } catch (err) {
    return next(err);
  }
}

export async function exploreProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    const profiles = await findFriends(req.user!.profileID);
    res.json(profiles);
  } catch (err) {
    return next(err);
  }
}

export async function readProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    const profiles = await findProfiles();
    res.json(profiles);
  } catch (err) {
    return next(err);
  }
}

export async function readAllGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const groups = await findAllGroups();
    res.json(groups);
  } catch (err) {
    return next(err);
  }
}

export async function readAllMemberGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const groups = await findAllMemberGroups(req.user!.profileID);
    res.json(groups);
  } catch (err) {
    return next(err);
  }
}

export async function readAllNonMemberGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const exploreGroups = await findAllNonMemberGroups(req.user!.profileID);
    res.json(exploreGroups);
  } catch (err) {
    return next(err);
  }
}

export async function readMessagesToUser(req: Request, res: Response, next: NextFunction) {
  try {
    const before = parseMessageCursor(req, res);
    if (before === false) return;
    const messages = await findMessagesToUser(req.user!.id, before);
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

export async function readMessagesToGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const before = parseMessageCursor(req, res);
    if (before === false) return;
    const messages = await findMessagesToGroups(req.user!.profileID, before);
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

function parseMessageCursor(
  req: Request,
  res: Response,
): MessageCursor | undefined | false {
  const cursor = req.query.before;
  const id = req.query.beforeId;
  if (cursor === undefined && id === undefined) return undefined;
  if (
    typeof cursor !== "string" ||
    typeof id !== "string" ||
    !/^[1-9]\d*$/.test(id)
  ) {
    res.status(400).json({ error: "Invalid message cursor" });
    return false;
  }
  const createdAt = new Date(cursor);
  const messageId = Number(id);
  if (Number.isNaN(createdAt.getTime()) || !Number.isSafeInteger(messageId)) {
    res.status(400).json({ error: "Invalid message cursor" });
    return false;
  }
  return { createdAt, id: messageId };
}

export async function readRecentMessagesToUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { recentDate } = matchedData(req);
    const messages = await findRecentMessagesToUser(req.user!.id, recentDate);
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

export async function readRecentMessagesToGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const { recentDate } = matchedData(req);
    const messages = await findRecentMessagesToGroups(
      req.user!.profileID,
      recentDate,
    );
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

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
import { matchedData } from "express-validator";

export async function readUserByID(req, res, next) {
  try {
    const user = await findUserByID(req.user.id);
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

export async function readProfileByUserId(req, res, next) {
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

export async function readFollowings(req, res, next) {
  try {
    const followings = await findFollowings(req.user.id);
    res.json(followings);
  } catch (err) {
    return next(err);
  }
}

export async function exploreProfiles(req, res, next) {
  try {
    const profiles = await findFriends(req.user.profileID);
    res.json(profiles);
  } catch (err) {
    return next(err);
  }
}

export async function readProfiles(req, res, next) {
  try {
    const profiles = await findProfiles();
    res.json(profiles);
  } catch (err) {
    return next(err);
  }
}

export async function readAllGroup(req, res, next) {
  try {
    const groups = await findAllGroups();
    res.json(groups);
  } catch (err) {
    return next(err);
  }
}

export async function readAllMemberGroup(req, res, next) {
  try {
    const groups = await findAllMemberGroups(req.user.profileID);
    res.json(groups);
  } catch (err) {
    return next(err);
  }
}

export async function readAllNonMemberGroup(req, res, next) {
  try {
    const exploreGroups = await findAllNonMemberGroups(req.user.profileID);
    res.json(exploreGroups);
  } catch (err) {
    return next(err);
  }
}

export async function readMessagesToUser(req, res, next) {
  try {
    const messages = await findMessagesToUser(req.user.id);
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

export async function readMessagesToGroups(req, res, next) {
  try {
    const messages = await findMessagesToGroups(req.user.profileID);
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

export async function readRecentMessagesToUser(req, res, next) {
  try {
    const { recentDate } = matchedData(req);
    const messages = await findRecentMessagesToUser(req.user.id, recentDate);
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

export async function readRecentMessagesToGroups(req, res, next) {
  try {
    const { recentDate } = matchedData(req);
    const messages = await findRecentMessagesToGroups(
      req.user.profileID,
      recentDate,
    );
    res.json(messages);
  } catch (err) {
    return next(err);
  }
}

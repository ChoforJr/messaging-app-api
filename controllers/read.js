import {
  findUserByID,
  findProfileByUserID,
  findProfiles,
  findAllGroups,
  findAllMemberGroups,
} from "../prisma_queries/find.js";

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
    const groups = await findAllMemberGroups(req.user.id);
    res.json(groups);
  } catch (err) {
    return next(err);
  }
}

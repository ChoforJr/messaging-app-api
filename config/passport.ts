import dotenv from "dotenv";
import path from "node:path";
import { compare } from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { findUserByUsername } from "../prisma_queries/find.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const jwtSecret = process.env.SECRET_KEY;
if (!jwtSecret) {
  throw new Error("SECRET_KEY environment variable is required");
}
const signingSecret: string = jwtSecret;

async function verifyCallback(
  username: string,
  password: string,
  done: (
    error: Error | null,
    user?: Express.User | false,
    info?: { message: string },
  ) => void,
) {
  try {
    const user = await findUserByUsername(username.toLowerCase());

    if (!user || !user.profile) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await compare(password, user.password);
    if (!match) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" });
    }

    return done(null, {
      id: user.id,
      username: user.username,
      profileID: user.profile.id,
    });
  } catch (err) {
    return done(err instanceof Error ? err : new Error(String(err)));
  }
}

passport.use("login", new LocalStrategy(verifyCallback));

passport.use(
  new JWTStrategy(
    {
      secretOrKey: jwtSecret,
      // Expect the token in the header: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (
      tokenPayload: { user: Express.User },
      done: (error: Error | null, user?: Express.User | false) => void,
    ) => {
      try {
        return done(null, tokenPayload.user);
      } catch (error) {
        return done(error instanceof Error ? error : new Error(String(error)));
      }
    },
  ),
);

export async function authLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    "login",
    async (
      err: Error | null,
      user: Express.User | false | null | undefined,
      info: { message?: string } | undefined,
    ) => {
      try {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
          });
        }
        if (!user) {
          return res.status(401).json({
            error: info?.message || "Authentication failed",
          });
        }

        req.login(user, { session: false }, (error) => {
          if (error) return next(error);

          const body = {
            id: user.id,
            username: user.username,
            profileID: user.profileID,
          };
          const token = jwt.sign({ user: body }, signingSecret, {
            expiresIn: "1h",
          });

          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    },
  )(req, res, next);
}

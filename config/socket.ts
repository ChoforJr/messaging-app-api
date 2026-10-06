import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

interface AuthenticatedSocketUser {
  id: number;
}

interface MessageSocketEvent {
  messageId: number;
  type: "direct" | "group";
}

function getSocketUser(token: unknown): AuthenticatedSocketUser | null {
  if (typeof token !== "string" || !process.env.SECRET_KEY) {
    return null;
  }

  try {
    const payload: unknown = jwt.verify(token, process.env.SECRET_KEY);
    if (
      typeof payload === "object" &&
      payload !== null &&
      "user" in payload &&
      typeof payload.user === "object" &&
      payload.user !== null &&
      "id" in payload.user &&
      typeof payload.user.id === "number"
    ) {
      return { id: payload.user.id };
    }
  } catch {
    return null;
  }

  return null;
}

let io: Server | null = null;

export function attachMessageSocket(
  httpServer: HttpServer,
  allowedOrigins: string[],
) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const user = getSocketUser(socket.handshake.auth.token);
    if (!user) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.data.userId = user.id;
    next();
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.data.userId}`);
  });

  return io;
}

export async function publishNewMessage(
  message: { id: number; authorId: number; toUserId: number | null; toGroupId: number | null },
) {
  if (!io) {
    throw new Error("Message socket server has not been initialized");
  }

  const payload: MessageSocketEvent = {
    messageId: message.id,
    type: message.toGroupId ? "group" : "direct",
  };

  if (message.toGroupId) {
    const group = await prisma.group.findUnique({
      where: { id: message.toGroupId },
      select: { members: { select: { userId: true } } },
    });
    const memberIds = group?.members.map((member) => member.userId) ?? [];
    for (const userId of new Set([message.authorId, ...memberIds])) {
      io.to(`user:${userId}`).emit("message:new", payload);
    }
    return;
  }

  if (message.toUserId) {
    for (const userId of new Set([message.authorId, message.toUserId])) {
      io.to(`user:${userId}`).emit("message:new", payload);
    }
  }
}

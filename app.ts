import express from "express";
import type { ErrorRequestHandler } from "express";
import { createServer } from "node:http";
import authRouter from "./routes/authRouter.js";
import path from "node:path";
import dotenv from "dotenv";
import "./config/passport.js";
import cors from "cors";
import type { CorsOptions } from "cors";
import { attachMessageSocket } from "./config/socket.js";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const whitelist = [
  process.env.ALLOWED_URL1,
  process.env.ALLOWED_URL2,
  process.env.ALLOWED_URL3,
  process.env.ALLOWED_URL4,
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the whitelist
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`BLOCKED BY CORS: ${origin}`); // Helps debugging!
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

const app = express();

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

console.log("--- CORS DEBUG ---");
console.log("Allowed URL 1:", process.env.ALLOWED_URL1);
console.log("Current CORS Options:", corsOptions.origin);
console.log("------------------");

app.use("/", authRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "CORS Blocked: Your origin is not on the whitelist.",
    });
  }

  // If it's not a CORS error, let Express handle it normally (or your own general error handler)
  return next(err);
};
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}
const server = createServer(app);
attachMessageSocket(server, whitelist);
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
server.on("error", (error) => {
  throw error;
});

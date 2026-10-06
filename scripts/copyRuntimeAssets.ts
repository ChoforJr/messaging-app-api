import { cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

for (const directory of ["generated", "public"]) {
  cpSync(
    path.join(projectRoot, directory),
    path.join(projectRoot, "dist", directory),
    { recursive: true },
  );
}

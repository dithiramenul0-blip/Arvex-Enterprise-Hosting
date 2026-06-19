import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { createReadStream, existsSync } from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const frontendDist = path.resolve(import.meta.dirname, "../../arvex/dist/public");

if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (_req, res) => {
    const indexPath = path.join(frontendDist, "index.html");
    const stream = createReadStream(indexPath);
    stream.pipe(res);
  });
} else {
  app.get("/", (_req, res) => {
    res.json({ status: "ArveX API running. Frontend not built yet." });
  });
}

export default app;

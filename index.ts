import express, { Express, Request, Response } from "express";
import cors from "cors";
import stitchRoute from "./src/modules/stitch/stitch";

const app: Express = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/stitch", stitchRoute);

app.get("/api", (req: Request, res: Response) => {
  res.send("Wapp Reminder Bot Working!");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

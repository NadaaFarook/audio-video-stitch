import express, { Request, Response } from "express";
import { stitchService } from "./stitch.service";

const stitchRoute = express.Router();

stitchRoute.post("/", async (req: Request, res: Response) => {
  const response = await stitchService(req);
  res.status(response["status"]);
  res.send(response);
});

export default stitchRoute;

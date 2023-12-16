import { Request } from "express";
import { IResponse } from "../../interfaces/response.interface";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { AppConfig } from "../../config";

const CONFIG = AppConfig();

export const stitchService = async (req: Request): Promise<IResponse> => {
  const { audio, videoFilePath } = req.body;

  const outputFilePath = `./temp/${uuidv4()}.mp4`;

  const response = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audio, function (err, metadata) {
      if (err) {
        reject(err);
      } else {
        const audioDuration = metadata.format.duration;
        ffmpeg()
          .input(videoFilePath)
          .inputOptions([`-stream_loop -1`, `-t ${audioDuration}`])
          .input(audio)
          .inputFormat("mp3")
          .outputOptions([])
          .on("end", () => {
            resolve(outputFilePath);
          })
          .on("error", (err) => {
            console.log("Error while processing", err);
            reject(err);
          })
          .save(outputFilePath);
      }
    });
  });

  const stitchedVideoUrl = await uploadToSupabase(response as string);

  return {
    status: 200,
    body: {
      data: stitchedVideoUrl,
      message: `Stitched video uploaded in supabase`,
    },
  };
};

async function uploadToSupabase(outputFilePath: string) {
  const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

  const videoBuffer = fs.readFileSync(outputFilePath);

  const filePath = `video/${uuidv4()}.mp4`;
  const { data, error } = await supabase.storage
    .from(CONFIG.SUPABASE_BUCKET!)
    .upload(filePath, videoBuffer, {
      contentType: "video/mp4",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: audio } = supabase.storage
    .from(CONFIG.SUPABASE_BUCKET!)
    .getPublicUrl(data?.path!);

  fs.unlinkSync(outputFilePath);

  return audio.publicUrl;
}

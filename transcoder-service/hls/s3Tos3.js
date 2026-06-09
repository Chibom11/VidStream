import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { Upload } from "@aws-sdk/lib-storage";
import { pipeline } from "stream/promises";

ffmpeg.setFfmpegPath(ffmpegStatic);

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const mp4FileName = "trial1.mp4";
const bucketName = process.env.AWS_BUCKET;
const hlsFolder = "hls";

const s3ToS3 = async () => {
  console.log("Starting script...");
  console.time("req_time");

  try {
    // ==========================
    // DOWNLOAD MP4 FROM S3
    // ==========================
    console.log("Downloading S3 mp4 file locally...");

    const localMp4Path = "./local.mp4";

    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: mp4FileName,
      })
    );

    await pipeline(
      response.Body,
      fs.createWriteStream(localMp4Path)
    );

    console.log("Downloaded S3 mp4 file locally");

    // ==========================
    // HLS PROFILES
    // ==========================
    const resolutions = [
      {
        resolution: "320x180",
        videoBitrate: "500k",
        audioBitrate: "64k",
      },
      {
        resolution: "854x480",
        videoBitrate: "1000k",
        audioBitrate: "128k",
      },
      {
        resolution: "1280x720",
        videoBitrate: "2500k",
        audioBitrate: "192k",
      },
    ];

    if (!fs.existsSync(hlsFolder)) {
      fs.mkdirSync(hlsFolder, { recursive: true });
    }

    const variantPlaylists = [];

    // ==========================
    // CREATE HLS VARIANTS
    // ==========================
    for (const {
      resolution,
      videoBitrate,
      audioBitrate,
    } of resolutions) {

      console.log(
        `HLS conversion starting for ${resolution}`
      );

      const outputFileName =
        `${mp4FileName.replace(".mp4", "")}_${resolution}.m3u8`;

      const segmentFileName =
        `${mp4FileName.replace(".mp4", "")}_${resolution}_%03d.ts`;

      await new Promise((resolve, reject) => {
        ffmpeg(localMp4Path)
          .outputOptions([
            "-c:v h264",
            `-b:v ${videoBitrate}`,
            "-c:a aac",
            `-b:a ${audioBitrate}`,
            `-vf scale=${resolution}`,
            "-f hls",
            "-hls_time 10",
            "-hls_list_size 0",
            `-hls_segment_filename hls/${segmentFileName}`,
          ])
          .output(`hls/${outputFileName}`)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      variantPlaylists.push({
        resolution,
        outputFileName,
      });

      console.log(
        `HLS conversion done for ${resolution}`
      );
    }

    // ==========================
    // MASTER PLAYLIST
    // ==========================
    console.log(
      "HLS master m3u8 playlist generating..."
    );

    let masterPlaylist = variantPlaylists
      .map((variant) => {

        const bandwidth =
          variant.resolution === "320x180"
            ? 676800
            : variant.resolution === "854x480"
            ? 1353600
            : 3230400;

        return (
          `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},` +
          `RESOLUTION=${variant.resolution}\n` +
          `${variant.outputFileName}`
        );
      })
      .join("\n");

    masterPlaylist =
      "#EXTM3U\n" + masterPlaylist;

    const masterPlaylistFileName =
      `${mp4FileName.replace(".mp4", "")}_master.m3u8`;

    const masterPlaylistPath =
      `hls/${masterPlaylistFileName}`;

    fs.writeFileSync(
      masterPlaylistPath,
      masterPlaylist
    );

    console.log(
      "HLS master m3u8 playlist generated"
    );

    // ==========================
    // DELETE LOCAL MP4
    // ==========================
    console.log(
      "Deleting locally downloaded mp4..."
    );

    fs.unlinkSync(localMp4Path);

    console.log(
      "Deleted locally downloaded mp4"
    );

    // ==========================
    // UPLOAD HLS FILES TO S3
    // ==========================
    console.log(
      "Uploading media playlists and ts segments to S3..."
    );

    const files = fs.readdirSync(hlsFolder);

    for (const file of files) {

      if (
        !file.startsWith(
          mp4FileName.replace(".mp4", "")
        )
      ) {
        continue;
      }

      const filePath = path.join(
        hlsFolder,
        file
      );

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: bucketName,
          Key: `${hlsFolder}/${file}`,
          Body: fs.createReadStream(filePath),
          ContentType: file.endsWith(".ts")
            ? "video/mp2t"
            : file.endsWith(".m3u8")
            ? "application/x-mpegURL"
            : undefined,
        },
      });

      await upload.done();

      fs.unlinkSync(filePath);
    }

    console.log(
      "Uploaded media playlists and ts segments to S3. Local files deleted."
    );

    console.log("Success");
    console.timeEnd("req_time");

  } catch (error) {
    console.error("Error:", error);
  }
};

export default s3ToS3;
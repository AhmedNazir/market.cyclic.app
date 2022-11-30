const express = require("express");
const fs = require("fs");
const ytdl = require("ytdl-core");

const router = express.Router();

router.get("/test", async (req, res) => {
    try {
        const link = req.query.link;
        // https://www.youtube.com/shorts/rtAqSXRp4Z8
        // const link = "https://www.youtube.com/watch?v=SN5_6mei0LA";
        // Example of choosing a video format.
        let videoID;
        if (link.indexOf("shorts")) {
            let arr = link.split("/");
            videoID = arr[arr.length - 1];
        } else {
            videoID = link.split("=")[1];
        }

        let info = await ytdl.getInfo(videoID);
        console.log(info.formats);
        const title = info.videoDetails.title;

        let format = ytdl.chooseFormat(info.formats, { quality: "135" });
        if (!format) format = ytdl.chooseFormat(info.formats, { quality: "134" });
        if (!format) format = ytdl.chooseFormat(info.formats, { quality: "136" });

        const filename = videoID + ".mp4";
        ytdl(link).pipe(fs.createWriteStream(filename));
        console.log(filename);
        console.log(videoID);

        fs.rename(filename, "public/videos/" + filename);

        res.json({ error: false, link, title, videoID, filename });
    } catch (error) {
        res.json({
            error: true,
            message: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        // Example of choosing a video format.
        const link = req.query.link;
        let videoID = link.split("=")[1];
        let info = await ytdl.getInfo(videoID);
        const title = info.videoDetails.title;
        let format = ytdl.chooseFormat(info.formats, { quality: "134" });
        if (!format) format = ytdl.chooseFormat(info.formats, { quality: "135" });
        if (!format) format = ytdl.chooseFormat(info.formats, { quality: "136" });
        ytdl(link).pipe(fs.createWriteStream(videoID + ".mp4"));

        res.json({ error: false, link, title, videoID, format: format.qualityLabel });
    } catch (error) {
        res.json({
            error: true,
            message: error.message,
        });
    }
});
module.exports = router;

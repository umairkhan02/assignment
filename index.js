const express = require('express');
const mysql = require('mysql');
const app = express();
const fs = require('fs');
const path = require('path');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'your_database_name'
});


connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});



app.use(express.static(path.join(__dirname, 'public')));

app.get('/video1', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/video2', function (req, res) {
    res.sendFile(path.join(__dirname, 'page2.html'));
});

app.get('/video3', function (req, res) {
    res.sendFile(path.join(__dirname, 'page3.html'));
});


app.get('/video1', function (req, res) {
    streamVideo(req, res, path.join(__dirname, 'videos', 'Video1.mp4'));
});

app.get('/video2', function (req, res) {
    streamVideo(req, res, path.join(__dirname, 'videos', 'Video2.mp4'));
});


app.get('/video3', function (req, res) {
    streamVideo(req, res, path.join(__dirname, 'videos', 'Video3.mp4'));
});



function streamVideo(req, res, videoPath) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range Header");
        return;
    }

    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
}

app.listen(3000, function () {
    console.log("Server is running on Port:", 3000);
});

"use strict";


var video = document.querySelector('video');
var recordingTimeMS = 5000;

document.getElementById("start").addEventListener("click", start);
// document.getElementById("stop").addEventListener("click", function () {
//     stop(video.srcObject);
// }, false);

function wait(delayInMS) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, delayInMS);
    });
}

function stop(stream) {
    stream.getTracks().forEach(function (track) {
        return track.stop();
    });
}

function record(audio, video, lengthInMS) {

    var stream = new MediaStream();

    // stream.addTrack(audio.getAudioTracks()[0]);
	stream.addTrack(video.getVideoTracks()[0]);
    
    var recorder = new MediaRecorder(stream);
    var data = [];

    recorder.ondataavailable = function (event) {
        return data.push(event.data);
    };

    recorder.start();
    console.log(recorder.state + " for " + lengthInMS / 1000 + " seconds...");

    var stopped = new Promise(function (resolve, reject) {
        recorder.onstop = resolve;
        recorder.onerror = function (event) {
            return reject(event.name);
        };
    });

    var recorded = wait(lengthInMS).then(function () {
        return recorder.state == "recording" && recorder.stop();
    });

    return Promise.all([stopped, recorded]).then(function () {
        return data;
    });
}

function start() {

    var canvas = document.querySelector('canvas');
    var downloadButton = document.getElementById("download");
    var recording = document.getElementById("recording");

    // var streamAudio = bg.captureStream(25);
    var streamVideo = canvas.captureStream(25);

    video.srcObject = streamVideo;
    downloadButton.href = streamVideo;
    video.captureStream = video.captureStream || video.mozCaptureStream;

    record(streamAudio, streamVideo, recordingTimeMS).then(function(recordedChunks) {
        var recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = "RecordedVideo.webm";

        console.log("successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
    });

}
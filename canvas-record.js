"use strict";

var video = document.querySelector('video');
var recordingTimeMS = 5000;

window.onload = function(){
    document.getElementById("gerar").addEventListener("click", function(){
        var formato = document.getElementById("personalizar-video").formato.value;
        switch(formato){
            case "basica": initTrackList(); break;
            case "imagens-textos": initImgTxt(); break;
            default: alert("Selecione o formato desejado no passo 2"); return false;
        }
        
        start();
    });
}

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

	stream.addTrack(video.getVideoTracks()[0]);
    // stream.addTrack(audio.getAudioTracks()[0]);
    
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

    downloadButton.setAttribute("class", "btn btn-danger");
        document.getElementById("exibir").setAttribute("class", "btn btn-danger");

    // var streamAudio = bg.captureStream(60);
    var streamVideo = canvas.captureStream(60);

    // video.srcObject = streamVideo;
    downloadButton.href = streamVideo;
    // video.captureStream = video.captureStream || video.mozCaptureStream;

    record(null, streamVideo, recordingTimeMS).then(function(recordedChunks) {
        var recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.src = URL.createObjectURL(recordedBlob);
        downloadButton.href = recording.src;
        downloadButton.download = "escola" + document.getElementById("personalizar-video").escola.value+".webm";
        downloadButton.setAttribute("class", "btn btn-success");
        document.getElementById("exibir").setAttribute("class", "btn btn-success");
        console.log("successfully recorded " + recordedBlob.size + " bytes of " + recordedBlob.type + " media.");
    });

}
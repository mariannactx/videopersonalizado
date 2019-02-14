var i = 0;
async function recordingVideo(dados){
    
    var canvasStream = canvas.captureStream(60);
    var videoTrack = canvasStream.getVideoTracks()[0];
    var videoStream = new MediaStream();
    videoStream.addTrack(videoTrack);
    var videoRecorder = new MediaRecorder(videoStream);
    
    var video = [];
    videoRecorder.ondataavailable = function (event) {
        video.push(event.data);
    }  
    
    videoRecorder.onerror = function (event) {
        console.log("canvas-record", event);
    };
    
    videoRecorder.start();
    
    var interval = setInterval(dados.draw, 0.01);
    
    for (var p in players){
        
        players[p].video.play();        
        var played = await delayVideo(players[p].video);
        
        i++; 
    }
    
    clearInterval(interval);
    
    var recorded = wait(dados.total).then(function () {
        return videoRecorder.state == "recording" && videoRecorder.stop();
    });
    
    var stopped = new Promise(function (resolve) {
        videoRecorder.onstop = resolve;
    });
    
    return Promise.all([stopped, recorded]).then(function () {
        console.log("Canvas recording completed successfully", video);        
        return video;
    });
} 

function delayVideo(video){
    return new Promise(function(resolve){
        video.onended = resolve;
        video.onpause = resolve;
    })
}

function wait(delayInS) {
    return new Promise(function (resolve) {
        var delayInMS = delayInS * 1000;
        return setTimeout(resolve, delayInMS);
    });
}
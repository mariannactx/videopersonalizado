"use strict";

var canvas;
window.onload = async function(){

    byId("gerar").addEventListener("click", async function(){
           
        if(!byId("timeline").children.length){
            alert("Não há vídeos na sua timeline"); 
            return false;
        }
          
        if(!formato){
            alert("Selecione o formato desejado no passo 1"); 
            return false;
        }
        
        // var progress = setProgress();
    
        record()
            .then( unmerged => merge(unmerged, total) )
            .then( async merged => {

                if(merged.unmerged){
                    merged = await merge(merged.unmerged);

                    if(merged.unmerged){
                        alert("Ocorreu um erro durante a renderização. Atualize a página e tente novamente.");

                        return false;
                    }
                }

                // clearInterval(progress);
                var src = getChunksUrl(merged);
                finish(src);
        }   );
        });
}

function addPlayer(chunks, type, parent, controls){
    
    var player = document.createElement(type);
    player.src = getChunksUrl(chunks);

    byId(parent).appendChild(player);
    
    return player;
}

function getChunksUrl(chunks){
    var blob = new Blob(chunks, { type: "video/webm" });
    return URL.createObjectURL(blob);
}

function record(){
    return new Promise(async function(resolve){
        
        var recordedVideo = await recordingVideo();
        var recordedAudio = await recordingAudio();

        resolve({
            video: recordedVideo,
            audio: recordedAudio
        })   
    })
}

async function merge(unmerged, total){

    var playerVideo = addPlayer(unmerged.video, "video", "merge", false);
    var playerAudio = addPlayer(unmerged.audio, "audio", "merge", false);

    var stream = new MediaStream();
    
    var videoStream = playerVideo.captureStream(60);
    
    var delayed = await streamDelay(videoStream);
       
    var videoTrack = videoStream.getVideoTracks()[0];
    stream.addTrack(videoTrack);

    var audioStream = playerAudio.captureStream(60);
    
    var delayed = await streamDelay(audioStream);
    
    var audioTrack = audioStream.getAudioTracks()[0];
    stream.addTrack(audioTrack);

    var recorder = new MediaRecorder(stream);
    
    var chunks = [];
    recorder.ondataavailable = function (event) {
        console.log("Merging data available");
        chunks.push(event.data);
    }  
    
    recorder.onerror = function (event) {
        console.log("Merging error", event);
    };
    
    recorder.start();
    
    playerVideo.play();
    playerAudio.play();

    var recorded = wait(total).then(function () {
        return recorder.state == "recording" && recorder.stop();
    });
    
    var stopped = new Promise(function (resolve, reject) {
        recorder.onstop = resolve;
    });
    
    return Promise.all([stopped, recorded]).then(function () {
        console.log("Video and audio merge into a unique source", chunks);
        
        if(!chunks[0].size)
            return {unmerged: unmerged}

        return chunks;
    });
} 

function streamDelay(stream){
    return new Promise(function(resolve){
        stream.onactive = resolve;
    });
}

var currentMs = 0;
function setProgress(total){
    
    var progressBar = byId("progress-bar");
    
    var totalInMs = total * 3.9 * 1000;
    return setInterval(function(){

        var currentProgress = parseFloat(progressBar.style.width);
        currentMs += 500;

        currentProgress = currentMs * 100 / totalInMs

        progressBar.style.width = currentProgress + "%";
    }, 500);
}
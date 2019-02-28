"use strict";

var canvas;
var currentMs = 0;
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
        
        //iniciar barra de progresso 
        // var progressBar = byId("progress-bar");    
        // var totalInMs = timeline.total * 3.9 * 1000;
        // var progress = setInterval(function(){
        //     currentMs += 500;
        //     progressBar.style.width = (currentMs * 100 / totalInMs) + "%";
        // }, 500);
        
        //layout antigo
        $('.collapse').collapse('hide')
        $('#passo4-body').collapse('show')
    
        recording()
            .then( unmerged => merge(unmerged, timeline.total) )
            .then( async merged => {
                
                console.log("primeira tentativa:", merged);

                if(merged.unmerged){
                    merged = await merge(merged.unmerged);
                    console.log("segunda tentativa:", merged);
                }

                if(merged.unmerged){
                    alert("Ocorreu um erro durante a renderização. Atualize a página e tente novamente.");

                    return false;
                }

                // clearInterval(progress);
                var src = getChunksUrl(merged);
                finish(src);
            });
        });
}

function recording(){
    return new Promise(async function(resolve){
        
        var recordedVideo = await recordVideos();
        var recordedAudio = await recordAudios();

        resolve({
            video: recordedVideo,
            audio: recordedAudio
        })   
    })
}

async function merge(unmerged){
    
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

    console.log("merge", unmerged);
    return new Promise(function (resolve) {
        record(stream, async function(){
            playerVideo.play();
            playerAudio.play();

            var delay = await recordDelay(timeline.total);
            return true;
        }).then( merged => {

            //se não mesclou, retorna os originais
            if(!merged)
                resolve({unmerged: unmerged});
            
            //se mesclou, retorna o resultado
            resolve(merged);
        });
    });
} 

async function record(stream, play){
    var recorder = new MediaRecorder(stream);
    
    var chunks = [];
    recorder.ondataavailable = function (event) {
        chunks.push(event.data);
    }  
    
    recorder.onerror = function (event) {
        console.log("media recording error: ", event);
    };
    
    recorder.start();

    console.log("play");
    //há um delay dentro do play  
    var played = await play();
    console.log("end");

    if(recorder.state == "recording"){
        recorder.stop()
    }

    return new Promise(function (resolve) {
        recorder.onstop = function (){
            console.log("Record completed successfully", chunks);
            
            if(!chunks[0].size)
                resolve(false);
    
            resolve(chunks);
        }
    });
}

function addPlayer(src, type, parent, controls){
    
    if(typeof(src) != "string")
        src = getChunksUrl(src);
    
    var player = document.createElement(type);
    player.src = src; 
    
    if(controls){
        player.width    = '384';
        player.height   = '216';
        player.controls = true;
    }
    
    byId(parent).appendChild(player);
    
    return player;
}

function getChunksUrl(chunks){
    var blob = new Blob(chunks, { type: "video/webm" });
    return URL.createObjectURL(blob);
}

function streamDelay(stream){
    return new Promise(function(resolve){
        stream.onactive = resolve;
    });
}

function recordDelay(delayInS) {
    return new Promise(function (resolve) {
        var delayInMS = delayInS * 1000;
        return setTimeout(resolve, delayInMS);
    });
}

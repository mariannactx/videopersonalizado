function recordVideos(){
    return new Promise(async function(resolve){
        var videos = timeline.videos; 

        //cortar videos (ignorando track de audio)
        for(var v in videos){
            var blobs = await cutVideo(videos[v]);
            timeline.videos[v].cut = getChunksUrl(blobs);
        }

        //mesclar videos usando canvas
        var video = await mergeVideos();

        //retornar video mesclado
        resolve(video);
    })
}

async function cutVideo(video){
    var player = addPlayer(video.src, "video", "merge", false);
    
    var videoStream = player.captureStream(60);
    var delayed = await streamDelay(videoStream);
    var videoTrack = videoStream.getVideoTracks()[0];
    var stream = new MediaStream();
    stream.addTrack(videoTrack);

    console.log("cut");
    return record(stream, async function(){
        player.play();
        var delay = await recordDelay(video.duration);
        return true;
    });

}

async function mergeVideos(){
    var canvasStream = byId("canvas").captureStream(60);
    var videoTrack = canvasStream.getVideoTracks()[0];
    var stream = new MediaStream();
    stream.addTrack(videoTrack);

    console.log("merge videos");
    return record(stream, async function(){
        var videos = timeline.videos;
        for (var v in videos){
            //desenha cada video da timeline no canvas
            var played = await draw(videos[v].cut);
        }

        return true;
    });
} 

function draw(src){
    return new Promise(function(resolve){
        var player = addPlayer(src, "video", "merge", false);
        player.play();
            
        var ctx = canvas.getContext('2d');

        //a cada 0.01 milisegundos, desenha o frame do vídeo no canvas
        var interval = setInterval(function(){ 
            if(player.paused || player.ended)	
                return false;
            
            console.log("draw");
            //limpar canvas
            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0,0,3840,2160); // clear canvas
            ctx.restore();
        
            ctx.drawImage(player,0,0,3840,2160); 
        }, 0.01);
            
        //encerra intervalo de desenho e gravação quando o vídeo acabar
        player.onended = function(){ 
            console.log("ended", interval);
            clearInterval(interval);
            resolve(true);
        };

        //encerra intervalo de desenho e gravação quando o vídeo pausar
        player.onpause = function(){ 
            console.log("pause", interval);
            clearInterval(interval);
            resolve(true);
        };
    })
}
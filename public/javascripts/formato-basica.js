async function getTrackList() {    

    var srcs = byId("timeline").children;
    
    var players = [];
    
    var duration = 0;
    
    for(var src in srcs){
        if(typeof(srcs[src]) == "object"){

            var video = document.createElement("video");
            video.id  = srcs[src].id;
            video.src = srcs[src].dataset.src + "#t="+ srcs[src].dataset.inicio + "," + srcs[src].dataset.final;
        
            duration += await loadMetaData(video);

            var audio = {
                src: srcs[src].dataset.src,
                inicio: srcs[src].dataset.inicio,
                final: srcs[src].dataset.final
            }

            players.push({
                video: video,
                audio: audio
            });
        }
    };

    return {
        players: players,
        draw: drawTrackList,
        total: duration + 1
    }
    
}

function loadMetaData(video){
    return new Promise(function(resolve){
        video.addEventListener('loadedmetadata', function() {
            resolve(video.duration)
        })
    });
}

function drawTrackList() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    //limpar canvas
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,3840,2160); // clear canvas
    ctx.restore();

    //inserir vídeo no canvas 
    ctx.drawImage(players[i],0, 0, 3840, 2160);
}


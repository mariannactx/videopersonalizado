async function getTrackList() {    

    var srcs = byId("timeline").children;
    
    var players = [];
    
    var total = 0;
    for(var src in srcs){
        if(typeof(srcs[src]) == "object"){

            var video = document.createElement("video");
            video.id  = srcs[src].id;
            video.src = srcs[src].dataset.src + "#t="+ srcs[src].dataset.inicio + "," + srcs[src].dataset.final;
            
            var duration = await loadMetaData(
                video,
                toSeconds(srcs[src].dataset.inicio),
                toSeconds(srcs[src].dataset.final)
            );
            
            total += duration;
            
            var audio = {
                src: srcs[src].dataset.src,
                inicio: toSeconds(srcs[src].dataset.inicio),
                final: toSeconds(srcs[src].dataset.final)
            }

            players.push({
                video: video,
                audio: audio,
                offset: toSeconds(srcs[src].dataset.inicio),
                duration: duration
            });
        }
    };

    return {
        players: players,
        draw: drawTrackList,
        total: total + 1
    }
    
}

function loadMetaData(video, inicio, final){
    return new Promise(function(resolve){
        video.addEventListener('loadedmetadata', function() {
            var duration = final - inicio;

            if(isNaN(duration) || duration < 0)
                duration = video.duration;

            resolve(duration);
        })
    });
}

function toSeconds(string) { 
    if (!string) 
        return null;

    var p = string.split(':'),
    s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

function drawTrackList() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    //limpar canvas
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,3840,2160); // clear canvas
    ctx.restore();

    //inserir vídeo no canvas 
    ctx.drawImage(players[i].video,0, 0, 3840, 2160);
}


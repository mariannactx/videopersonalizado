async function getTrackList() {    
    
    var srcs = [
        "vid/list1.mp4",  
        "vid/vid1.mp4",  
        "vid/list2.mp4",
        "vid/vid2.mp4",
        "vid/list3.mp4",
    ];
    
    var players = [];
    
    var duration = 0;
    for(var src in srcs){
        var video = document.createElement("video");
        video.id  = src;
        video.src = srcs[src];
       
        duration += await loadMetaData(video);

        players.push(video);
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


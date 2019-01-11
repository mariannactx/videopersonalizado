var vids = [];
var i = 0;
var trackList;

function initTrackList(){
    recordingTimeMS = 10000;

    var srcs = [
        "vid/list1.mp4",
        "vid/list2.mp4",
        "vid/list3.mp4",
    ];

    srcs.forEach(function(src){
        var newVid = document.createElement("video");
        newVid.src = src;
        
        newVid.onended = function(e){ 
            i++; 

            if(!vids[i]){
                clearInterval(trackList);
                return true;
            }
            //play no próximo vídeo
            vids[i].play();
        }

        vids.push(newVid);
    });

    //play no primeiro vídeo
    vids[i].play();

    
    trackList = setInterval(drawTrackList, 0.01);
  
}

function drawTrackList() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    //limpar canvas
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,3840,2160); // clear canvas
    ctx.restore();

    //inserir vídeo no canvas 
    ctx.drawImage(vids[i],0, 0, 3840, 2160);
}


var vids = [];



var i = 0;
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
            console.log(vids[i]);
            vids[i].play();
        }

        vids.push(newVid);
    });

    vids[i].play();
    var trackList = setInterval(drawTrackList, 0.01);
  
}

function drawTrackList() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,3840,2160); // clear canvas
    ctx.restore();

    ctx.drawImage(vids[i],0, 0, 3840, 2160);
}


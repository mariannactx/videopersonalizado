var vids = [];
var imgs = [];

var escolas = {
    escola1: "Escola 1",
    escola2: "Escola 2",
}

var escolaId = "escola2";

var i = 0;
function initMosaic(){
    recordingTimeMS = 10000;
    for(var img = 1; img < 10; img++){
        var newImg = new Image();
        newImg.src = "src/photos/"+escolaId+"/Group "+img+".png";

        imgs[img] = newImg;
    }

    var srcs = [
        "vid/parte1.mp4",
        "mosaico",
        "vid/parte2.mp4",
    ];
    srcs.forEach(function(src){
        if(src == "mosaico"){
            vids.push(src);
        } else {
            
            var newVid = document.createElement("video");
            newVid.src = src;
            
            newVid.onended = function(e){ 
                i++; 

                if(!vids[i]){
                    clearInterval(trackList);
                    return true;
                }

                vids[i].play();
            }

            vids.push(newVid);

        }
    });

    vids[i].play();
    var trackList = setInterval(drawMosaic, 0.01);
  
}

function drawMosaic() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,1280,720); // clear canvas

    if(vids[i] == "mosaico"){
        
        var ctx = document.getElementById('canvas').getContext('2d');
        
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0,0,1280,720); // clear canvas

        var img = 1;
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                ctx.drawImage(imgs[img], 426 * col, 240 * row, 426, 240);
                img++;
            }  
        }

    } else {
        ctx.drawImage(vids[i],0, 0, 1280, 720);
    }
}


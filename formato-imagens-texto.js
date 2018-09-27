
var mapa = new Image();
var base = document.createElement("video");

var escolas = {
    escola1: "Escola 1 - João Pessoa",
    escola2: "Escola 2 - Santa Rita",
}

var escolaId;

function initImgTxt(){
    base.src = "vid/baseImgFixa.mp4";
    base.play();

    escolaId = "escola" + document.getElementById("personalizar-video").escola.value;
    mapa.src = "src/photos/"+escolaId+"/mapa.png";
    var trackList = setInterval(drawImgTxt, 0.01);
  
}

function drawImgTxt() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,1280,720);
    ctx.restore();
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(escolas[escolaId], 1075, 525);
    ctx.drawImage(mapa,790,225,490,265);
    ctx.drawImage(base,0, 0, 1280, 720);
}


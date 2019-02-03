
var mapa = new Image();
var base = document.createElement("video");

var escolas = {
    escola1: "Escola 1 - João Pessoa",
    escola2: "Escola 2 - Santa Rita",
}
var escolaId;

var trackList;
function initImgTxt(){
    base.src = "vid/baseImgFixa.mp4";
    base.onended = function(e){
        clearInterval(trackList);
    }
    base.play();

    escolaId = "escola" + document.getElementById("personalizar-video").escola.value;
    mapa.src = "src/photos/"+escolaId+"/mapa.png";
    trackList = setInterval(drawImgTxt, 0.01);
  
}

function drawImgTxt() {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    //limpar canvas
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,1280,720);
    ctx.restore();

    //inserir texto
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(escolas[escolaId], 1075, 525);

    //inserir imagem
    ctx.drawImage(mapa,790,225,490,265);

    //inserir video
    ctx.drawImage(base,0, 0, 1280, 720);
}


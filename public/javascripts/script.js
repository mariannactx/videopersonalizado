window.addEventListener("load", function(){
    byId("upload").addEventListener("change", setPreviaUpload);

    var popups = ['upload', 'edit', 'acervo', 'add-acervo'];
    popups.forEach(function(popup){
        byId("previa-popup-" + popup).addEventListener("canplaythrough", function (e){
            byId(e.target.dataset.status).style.display = "none";
            e.target.play();   
        });
    })

    byId("form").addEventListener("submit", salvarPersonalizado);
    byId("form").addEventListener("reset", finalizarEdicao);
})

// Abas
function abrirAba(abaId){
    
    byId("aba-" + abaId).style.display = 'block';
    byId("btn-aba-" + abaId).setAttribute("class", "btn main active");
    
    var fecharAbaId = abaId == 1 ? 2 : 1;
    byId("aba-" + fecharAbaId).style.display = 'none';
    byId("btn-aba-" + fecharAbaId).setAttribute("class", "btn main");
}

//Pop-ups
function abrirPopup(popup){
    byId("popup-" + popup).style.display = 'block';
    byId("background-popup").setAttribute("class","show");
}

function fecharPopup(popup){
    byId("background-popup").setAttribute("class","");
    
    byId("popup-" + popup).style.display = 'none';

    if(byId("previa-popup-" + popup))
        byId("previa-popup-" + popup).src = "";

    if(byId("inicio-popup-" + popup))
        byId("inicio-popup-" + popup).value = "";

    if(byId("final-popup-" + popup))
        byId("final-popup-" + popup).value = "";
}

var previas = {acervo: []}
function exibirAcervo(video){
    setPreviaAcervo('acervo', video);
}

function addAcervo(video){
    setPreviaAcervo('add-acervo', video);
}

function setPreviaAcervo(popup, video){
    //se vídeo já foi visualizado, exibe no popup
    if(previas.acervo[video.id]){
        byId("previa-popup-" + popup).dataset.id = video.id;
        setPrevia(popup, previas.acervo[video.id]);
        return true;
    }

    abrirPopup(popup);
    
    // exibe status carregamento do vídeo do acervo
    byId("status-popup-" + popup).style.display = "block";   
    var progressBar = byId("progress-" + popup);
    
    var path = "/videos/" + video.arquivo;

    //carregar blob de vídeo para permitir tocar sem travar
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.responseType = 'blob';

    req.onload = function() {

        //onload é disparado em qualquer status, então é preciso
        //checar se o status é 200
        if (this.status === 200) {
            var blob = this.response;
            var src = URL.createObjectURL(blob);

            previas.acervo[video.id] = src;
            
            byId("previa-popup-" + popup).dataset.id = video.id;
            setPrevia(popup, src);
            
            return true;
        }

        console.log("Not status 200 on load:", this);
    }

    req.onerror = function() {
        console.log("Error:", this);
    }

    req.onprogress = function (e) {
        if (e.lengthComputable) {
            progressBar.max = e.total;
            progressBar.value = e.loaded;
        }
    }

    req.onloadstart = function () {
        progressBar.value = 0;
    }

    req.onloadend = function (e) {
        progressBar.value = e.loaded;
    }

    req.send();
}

function setPreviaUpload(event){
    var tmppath = URL.createObjectURL(event.target.files[0]);
    setPrevia('upload', tmppath);
    event.target.value = "";    
}

function setPrevia(popup, src){
    byId("previa-popup-" + popup).src = src;
    if(byId("status-popup-" + popup))
        byId("status-popup-" + popup).style.display = "block";
        
    abrirPopup(popup); 
}

//Ações da timeline: add, remove, edit, save, finish
var timeline = { "videos": [], "total": 0};
function add(popup){

    var path   = byId("previa-popup-" + popup).src;
    var inicio = byId("inicio-popup-" + popup).value;
    var final  = byId("final-popup-"  + popup).value;
    
    var video = document.createElement("div");
    video.id = timeline.videos.length;
    
    setVideoProps(video.id, {
        "path"     : path,
        "src"      : `${path}#t=${inicio},${final}`,
        "inicio"   : inicio,
        "final"    : final,
        "offset"   : toSeconds(inicio),
        "duration" : getDuracao(inicio, final),
    });
    
    var editIcon = document.createElement("i");
    editIcon.setAttribute("class", "fas fa-edit");
    editIcon.addEventListener("click", edit);
    
    var removeIcon = document.createElement("i");
    removeIcon.setAttribute("class", "fas fa-times");
    removeIcon.addEventListener("click", remove);
    
    video.appendChild(editIcon);
    video.appendChild(removeIcon);
    
    byId("timeline").appendChild(video);

    fecharPopup(popup);
}

// confs: path, src, inicio, final, offset, duration
function setVideoProps(id, confs){
    if(!timeline.videos[id])
        timeline.videos[id] = {}

    for(var c in confs)
        timeline.videos[id][c] = confs[c]
}

function remove(e){
    var parent = e.target.parentNode;
    timeline.splice(e.target.id, 1);
    parent.remove(e.target);
}

function edit(e){
    var video = e.target.parentNode;
    
    byId("video-id-popup-edit").value = video.id;
    byId("inicio-popup-edit").value   = timeline[video.id].inicio;
    byId("final-popup-edit").value    = timeline[video.id].final;
  
    setPrevia('edit', timeline[video.id].path);
}

function save(){
    var videoId = byId("video-id-popup-edit").value;
    var inicio = byId("inicio-popup-edit").value;
    var final = byId("final-popup-edit").value;
    
    var src = `${timeline[videoId].path}#t=${inicio},${final}`;

    setVideoProps(videoId, {
        "src"      : src,
        "inicio"   : inicio,
        "final"    : final,
        "offset"   : toSeconds(inicio),
        "duration" : getDuracao(inicio, final)
    });

    fecharPopup("edit");
}

function finish(video){
    byId("previa").src = video;
    byId("baixar").href = video;
    fecharPopup("progress");
    abrirPopup("gerar")
}

function byId(id){
    return document.getElementById(id);
}

function getDuracao(inicio, final){
    var inicioInS = toSeconds(inicio);
    var finalInS  = toSeconds(final)
    var duracao = finalInS - inicioInS;

    if(isNaN(duracao) || duracao < 0)
        duracao = null;

    return duracao;
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

//Ações do popup de gerar vídeo: salvar personalizado, baixar, finalizar edição
function salvarPersonalizado(e){
    e.preventDefault();

    var reader = new FileReader();
    reader.onload = function() {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if ((request.readyState == 4) && (request.status == 200))
                alert(JSON.parse(request.response));
        }
    
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
    
        var timelineData = new FormData();
        timelineData.append('base64',  base64);
        timelineData.append('titulo',    byId("titulo").value);
        timelineData.append('descricao', byId("descricao").value);
        
        request.open("POST", "/salvar-video", true);
        request.send(timelineData);
    
    };
    console.log(timeline.blob);
    reader.readAsDataURL(timeline.blob);
    return false;
}

function finalizarEdicao(){
    location.reload();
}
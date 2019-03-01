var canvas;
window.addEventListener("load", function(){
    canvas = byId("canvas");
    
    byId("upload").addEventListener("change", setPreviaUpload);

    var popups = ['upload', 'edit'];
    popups.forEach(function(popup){
        byId("previa-popup-" + popup).addEventListener("canplaythrough", playPrevia);
    })
    
})

//Pop-ups
function abrir(popup){
    byId("popup-" + popup).style.display = 'block';
}

function fechar(popup){
    byId("popup-" + popup).style.display = 'none';

    if(byId("previa-popup-" + popup))
        byId("previa-popup-" + popup).src = "";

    if(byId("inicio-popup-" + popup))
        byId("inicio-popup-" + popup).value = "";

    if(byId("final-popup-" + popup))
        byId("final-popup-" + popup).value = "";
    
}

function setPreviaSalvos(video){
    finalizar("/videos/" + video);
}

var previas = {acervo: [], upload: []}
function setPreviaAcervo(video){

    //se vídeo já foi visualizado, exibe no popup
    if(previas.acervo[video.id]){
        setPrevia('acervo', previas.acervo[video.id].src);
        return true;
    }
    
    // exibe status carregamento do vídeo do acervo
    byId("status-popup-acervo").style.display = "block";   
    var progressBar = byId("progress-acervo");
    
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

            previas.acervo[video.id] = {
                path: path,
                blob: blob,
                src: src
            };
            
            byId("previa-popup-acervo").dataset.id = video.id;
            setPrevia('acervo', src);
            
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

    req.onloadstart = function (e) {
        progressBar.value = 0;
    }

    req.onloadend = function (e) {
        progressBar.value = e.loaded;
    }

    req.send();

    abrir('acervo');
}

function setPreviaUpload(event){
    byId("previa-popup-upload").dataset.id = previas.upload.length;
    
    var tmppath = URL.createObjectURL(event.target.files[0]);
    
    previas.upload.push({
        blob: event.target.files[0],
        path: tmppath
    });
    
    setPrevia('upload', tmppath);
}

function setPrevia(popup, src){
    byId("previa-popup-" + popup).src = src;
    byId("status-popup-" + popup).style.display = "block";   
}

function playPrevia(e){
    byId(e.target.dataset.status).style.display = "none";
    e.target.play();   
}

//Ações da timeline: add, remove, edit, save, finish
var timeline = { "videos": [], "total": 0};
function add(popup){

    var src    = byId("previa-popup-" + popup).src;
    var inicio = byId("inicio-popup-" + popup).value;
    var final  = byId( "final-popup-" + popup).value;
    
    var video = document.createElement("div");

    video.id = timeline.videos.length;
    video.dataset.src    = src;
    video.dataset.inicio = inicio;
    video.dataset.final  = final;
    
    var inicioInS = toSeconds(inicio);
    var finalInS  = toSeconds(final)
    var duracao = finalInS - inicioInS;

    if(isNaN(duracao) || duracao < 0)
        duracao = null;

    var previaId = byId("previa-popup-" + popup).dataset.id;
    
    setTimelineVideo(video.id, {
        "src"      : src + "#t=" + inicio + "," + final,
        "offset"   : inicioInS,
        "duration" : duracao,
        "path"     : previas[popup][previaId].path,
        "blob"     : previas[popup][previaId].blob
    });
    
    var editIcon = document.createElement("i");
    editIcon.setAttribute("class", "fas fa-edit");
    editIcon.addEventListener("click", edit);
    video.appendChild(editIcon);
 
    var removeIcon = document.createElement("i");
    removeIcon.setAttribute("class", "fas fa-times");
    removeIcon.addEventListener("click", remove);
    video.appendChild(removeIcon);

    fechar(popup);    

    byId("timeline").appendChild(video);
}

// confs: src, offset, duration, path, blob
function setTimelineVideo(id, confs){
    timeline.videos[id] = {}

    for(var c in confs){
        timeline.videos[id][c] = confs[c]
    }
}

function remove(e){
    var parent = e.target.parentNode;
    timeline.splice(e.target.id, 1);
    parent.remove(e.target);
}

function edit(e){

    var video = e.target.parentNode;
    
    byId("video-id-popup-edit").value = video.id;
    byId("inicio-popup-edit").value   = video.dataset.inicio;
    byId("final-popup-edit").value    = video.dataset.final;
    
    //to do: edit
    setPrevia('edit', video.dataset.src);

    abrir('edit');
}

function save(){
    var video = byId(byId("video-id-popup-edit").value);

    video.dataset.inicio = byId("inicio-popup-edit").value;
    video.dataset.final = byId("final-popup-edit").value;

    fechar("edit");
}

function finish(video){
    
    byId("previa").src = video;
    byId("baixar").href = video;
    
    if(formato == "acervo")
        byId("form").style.display = "none";
    
}

function byId(id){
    return document.getElementById(id);
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

var formato = false;
function setFormato(f){
    formato = f;
}
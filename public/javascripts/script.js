window.addEventListener("load", function(){
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

var acervo = [];
function popupAcervo(video){

    if(acervo[video.id]){
        setPrevia('acervo', acervo[video.id].src);
        return true;
    }
    
    // var path = "/videos/" + video.arquivo;
    var path = "videos/" + video.arquivo;
    byId("status-popup-acervo").style.display = "block";   
    var progressBar = byId("progress-acervo");
    
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

            acervo[video.id] = {
                path: path,
                blob: blob,
                src: src
            };
            
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
    var tmppath = URL.createObjectURL(event.target.files[0]);
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

//Passo a passo
function add(popup){

    var src    = byId("previa-popup-" + popup).src;
    var inicio = byId("inicio-popup-" + popup).value;
    var final  = byId( "final-popup-" + popup).value;
    
    var video = document.createElement("div");

    var date = new Date(); 
    var timestamp = date.getTime();
    video.id = timestamp;

    video.dataset.src = src;
    video.dataset.inicio = inicio;
    video.dataset.final =final;
        
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

function remove(e){
    var parent = e.target.parentNode;
    parent.remove(e.target);
}

function edit(e){

    var video = e.target.parentNode;
    
    byId("video-id-popup-edit").value = video.id;
    byId("inicio-popup-edit").value   = video.dataset.inicio;
    byId("final-popup-edit").value    = video.dataset.final;
    
    setPrevia('edit', video.dataset.src);

    abrir('edit');
}

function save(){
    var video = byId(byId("video-id-popup-edit").value);

    video.dataset.inicio = byId("inicio-popup-edit").value;
    video.dataset.final = byId("final-popup-edit").value;

    fechar("edit");
}

function previaSalvos(video){
    iniciar();
    // finalizar("/videos/" + video);
    finalizar("videos/" + video);
}

function iniciar(){
    $('.collapse').collapse('hide')
    $('#passo4-body').collapse('show')
}

function finalizar(video){
    
    byId("previa").src = video;
    byId("baixar").href = video;
    
    if(formato == "acervo")
        byId("form").style.display = "none";
    
}

function byId(id){
    return document.getElementById(id);
}

var formato = false;
function setFormato(f){
    formato = f;
}
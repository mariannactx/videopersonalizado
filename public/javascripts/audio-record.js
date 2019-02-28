const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function recordAudios(){
    return new Promise(async function (resolve){
        //criar um contexto de áudio para mesclar todos os áudios
        //exemplo: OfflineAudioContext(2,44100*40,44100);
        var offline = new OfflineAudioContext(2,44100 * timeline.total, 44100);
        
        var when = 0;
        var videos = timeline.videos;
        for(var v in videos){  

            // gera um buffer para cada áudio
            var buffer = await getFile(videos[v].src)
            .then(track => playTrack(track, offline, when, videos[v].offset, videos[v].duration))
            .catch( error => { console.log(error); });
            
            //insere a duração do vídeo para ter um delay no start do próximo vídeo
            when += videos[v].duration;
        }; 
        
        offline.startRendering().then(function(renderedBuffer) {
            console.log('Rendering and merging audio buffers completed successfully');
                        
            var dest = audioCtx.createMediaStreamDestination();
            var source = audioCtx.createBufferSource();
            
            source.buffer = renderedBuffer;
            var audioRecorder = new MediaRecorder(dest.stream);
            source.connect(dest)
            
            var chunks = [];
            audioRecorder.ondataavailable = function(evt) {
                chunks.push(evt.data);
            };
            
            audioRecorder.onstop = function() {
                console.log('Converting audio buffer to blob completed successfully', chunks);
                resolve(chunks);
            };

            audioRecorder.start();
            
            source.onended = function(){
                audioRecorder.requestData();
                audioRecorder.stop();
            }
            
            source.start();
        });
    });
}

// function for fetching the audio file and decode the data
async function getFile(filepath) {

    return fetch(filepath)
    .then(file => file.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .catch( error => { console.log(error); });

}

// create a buffer, plop in data, connect and play -> modify graph here if required
function playTrack(audioBuffer, offline, when, offset, duration) {
    
    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended')
        audioCtx.resume();
        
    const trackSource = offline.createBufferSource();
    trackSource.buffer = audioBuffer;
    trackSource.connect(offline.destination)

    //AudioBufferSourceNode.start([when][, offset][, duration]);
    trackSource.start(when, offset, duration);
    
    return duration;
}

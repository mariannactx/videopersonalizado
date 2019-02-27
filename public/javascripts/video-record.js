var i = 0;
async function recordingVideo(){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if ((request.readyState == 4) && (request.status == 200))
            resolve(JSON.parse(request.response));
        }
        
        request.open("POST", "/video-record", true);

        var timelineData = new FormData();
        
        console.log("timeline: ", timeline);
        
        timeline.forEach(function(video, key){
            console.log(video); 
            var prefix = "timeline[" + key + "]";
            
            timelineData.append(prefix + "[src]"      , video.src    );
            timelineData.append(prefix + "[offset]"   , video.offset );
            timelineData.append(prefix + "[duration]" , video.duration);
            timelineData.append(prefix + "[path]"     , video.path   );
            timelineData.append(prefix + "[blob]"     , video.blob   );

        });

        timelineData.append("length", timeline.length);

        request.send(timelineData);
    })
} 

function wait(delayInS) {
    return new Promise(function (resolve) {
        var delayInMS = delayInS * 1000;
        return setTimeout(resolve, delayInMS);
    });
}
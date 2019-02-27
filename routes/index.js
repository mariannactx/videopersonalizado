var express = require('express');
var router = express.Router();
var fluent_ffmpeg = require("fluent-ffmpeg");
var toStream = require('blob-to-stream');
var multiparty = require('multiparty');

/* GET home page. */
router.get('/', function(req, res, next) {
   
    var getAcervo = new Promise(function(resolve, reject){
        var acervo = require("../models/acervo");
        acervo.find().then(function(result){
            resolve(result);
        });
    });
    
    var getVideosPersonalizados = new Promise(function(resolve, reject){
        var videosPersonalizados = require("../models/videosPersonalizados");
        videosPersonalizados.find().then(function(result){
            resolve(result);
        });
    });
    
    var data = {};
    //buscar acervo
    getAcervo.then(function(acervo){
        data.acervo = acervo;
        //buscar videos personalizados
        getVideosPersonalizados.then(function(videos){
            data.videosPersonalizados = videos;
            res.render('index', data);  
        })
    }).catch(function(err) { 
        console.log(err);
        res.redirect("/");
    });
});

router.post('/video-record', function(req, res, next){

    var form = new multiparty.Form();    
    form.parse(req, function(err, fields, files) {
        console.log("Erro:" , err);
        
        var timeline = []
        for (var key = 0; key<fields.length; key++){
            var prefix = "timeline[" + key + "]";
            
            timeline.push({
                "src"      : fields[prefix + "[src]"     ],
                "offset"   : fields[prefix + "[offset]"  ],
                "duration" : fields[prefix + "[duration]"],
                "path"     : fields[prefix + "[path]"    ],
                "blob"     :  files[prefix + "[blob]"    ][0]
            });
        }
                
        var merged = fluent_ffmpeg();
        timeline.forEach(function(video){
            
            merged = merged
            .input(video.blob.path)
            .setStartTime(video.offset)
            .duration(video.duration);
            
        });
        
        merged
        .on('error', function(err) {
            console.log('Error ' + err.message);
        })
        .on('end', function() {
            return res.json("videos/mergedVideo.mp4");
        })
        .mergeToFile('./public/videos/mergedVideo.mp4')
        
    });   
});
module.exports = router;

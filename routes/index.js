var express = require('express');
var router = express.Router();

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

module.exports = router;

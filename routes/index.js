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
    
    var getPersonalizados = new Promise(function(resolve, reject){
        var personalizados = require("../models/personalizados");
        personalizados.find().then(function(result){
            resolve(result);
        });
    });
    
    var data = {};
    //buscar acervo
    getAcervo.then(function(acervo){
        data.acervo = acervo;
        //buscar videos personalizados
        getPersonalizados.then(function(videos){
            data.personalizados = videos;
            res.render('index', data);  
        })
    }).catch(function(err) { 
        console.log(err);
        res.redirect("/");
    });
});

module.exports = router;

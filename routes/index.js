var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');

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

router.post('/salvar-video', function(req, res, next){
    var personalizados = require("../models/personalizados");

    var form = new multiparty.Form({"maxFieldsSize": "100mb"});    
    form.parse(req, function(err, fields, files) {
        
        if(err){
            console.log("Erro:" , err);
            return res.json("Ocorreu um erro ao carregar o vídeo.");
        }
    
        var buf = new Buffer(fields['base64'][0], 'base64'); // decode
        var file = Date.now() + ".webm";
        fs.writeFile("./public/videos/" + file, buf, function(err) {
            
            if(err){
                console.log("err", err);
                return res.json("Ocorreu um erro ao salvar o vídeo.");
            }

            var video = {
                'titulo'   : fields['titulo'][0],
                'descricao': fields['descricao'][0],
                'arquivo'  : file,
                'thumb'    : 'default.png'
            };

            personalizados.insertOne(video).then(function(result){
                if(result.status != 200){
                    console.log("err", result.msg);
                    return res.json("Ocorreu um erro ao registrar o vídeo.");
                }

                return res.json("Vídeo salvo com sucesso");
            });
        });
    });   
});

module.exports = router;

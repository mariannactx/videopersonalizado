var db = require('../database/database');
var ffmpeg = require('fluent-ffmpeg');

const table = 'videos_personalizados';
const cols = ['id', 'titulo', 'descricao', 'arquivo', 'thumb'];

var findOne = function(id){
    id = parseInt(id);
    var query = db.getQuery.findOne(cols, table, id);
    return db.doQuery(query);
}

var insertOne = function(vals){
    
    // var proc = new ffmpeg('public/videos/ferramentas_de_controle.mp4')
    
    // .on('filenames', function(filenames) {
    //     console.log('screenshots are ' + filenames.join(', '));
    // })
    // .on('error', function(err, stdout, stderr) {
    //     console.log(err.message);
    // })
    // .screenshots({
    //     count: 1,
    //     timestamps: [ '4' ],
    //     filename: 'ferramentas_de_controle.png',
    //     folder: 'public/videos',
    //     size: '320x240'
    // })

    var columns = [];
    var values = [];

    cols.forEach(function(col){
        if(vals[col]){
            columns.push(col);
            values.push(vals[col]);
        }
    });
   
    var query = db.getQuery.insertOne(table, columns, values);
    
    return db.doQuery(query)
    .then(function(result){
        console.log(result);
        return { status: 200, msg: "Vídeo inserido com sucesso" }
    })
    .catch(function(err) { 
        console.log(err);
        
        if(err.errno == 1062){
            return { status: 400, msg: "Vídeo já existe no sistema" }
        }
        
        return { status: 400, msg: "Erro" };
    });
}

var find = function(){
    var query = db.getQuery.find(cols, table);
    return db.doQuery(query);
}

module.exports.find = find;
module.exports.findOne = findOne;
module.exports.insertOne = insertOne;

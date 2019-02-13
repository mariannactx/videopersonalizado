var db = require('../database/database');

const table = 'acervo';
const cols = ['id', 'titulo', 'descricao', 'arquivo', 'thumb'];

var findOne = function(id){
    id = parseInt(id);
    var query = db.getQuery.findOne(cols, table, id);
    return db.doQuery(query)
}

var find = function(){
    var query = db.getQuery.find(cols, table);
    return db.doQuery(query);
}

var insertOne = function(req){
        
    var columns = [];
    var values = [];

    cols.forEach(function(col){
        if(req.body[col]){
            columns.push(col);
            values.push(req.body[col]);
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

module.exports.find = find;
module.exports.findOne = findOne;
module.exports.insertOne = insertOne;

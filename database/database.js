var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit    : 10,
    database           : 'tce-mapa',
    multipleStatements : true
});

doQuery = function (query) {
    var db = this;
    
    if(query.query){
        var values = query.values;
        var query = query.query;
    }
    
    return new Promise(function(resolve, reject){
        db.pool.getConnection(function(err, connection) {
            
            if (err) reject(err);
        
            connection.query(query, values, function (err, result) {
                connection.release();
            
                if (err) reject(err)
                resolve(result);
                
            })
        });
    });
}

getQuery = {
    findOne : function(cols, table, id){
        id = parseInt(id);
        return "SELECT "+cols+" FROM "+table+" WHERE id = " + id;
    },
    insertOne : function(table, columns, values){ 
        var cols = columns.join(",");     
        return {
            query: "INSERT INTO "+ table +" ("+ cols +") VALUES (?)",
            values: [values]
        }
    },
    updateOne : function(table, id, set){
        return "UPDATE "+ table +" SET "+set+" WHERE id = " + id
    },
    deleteOne : function(table, id){
        if(!id)
            return false;
            
        id = parseInt(id);
        return "DELETE FROM "+ table +" WHERE id = " + id
    }, 
    find : function(cols, table, where, order, limit){
        cols = cols || "*";
        
        var query = "SELECT "+ cols +" FROM "+table;
        
        if(where)
            query += " WHERE " + where
        
        if(order)
            query += " ORDER BY " + order
        
        if(limit)
            query += " LIMIT " + limit
        
        return query;
    }
};

module.exports.mysql = mysql;
module.exports.pool = pool;
module.exports.getQuery = getQuery;
module.exports.doQuery = doQuery;
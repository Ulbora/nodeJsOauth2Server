var mysql = require('mysql');
var pool;
exports.connect = function (host, user, pw, db, cpnum) {
    pool = mysql.createPool({
        connectionLimit: cpnum,
        host: host,
        user: user,
        password: pw,
        database: db
    });
};
exports.testConnection = function (callback) {
    var rtn = false;
    pool.getConnection(function (err, connection) {
        if (!err && connection) {
            connection.release();
            rtn = true;
        }
        callback(rtn);
    });
};

exports.insert = function (query, args, callback) {
    var rtn = -1;
    pool.query(query, args, function (err, result) {
        if (!err && result.insertId) {
            rtn = result.insertId;
            callback(rtn);
        }else{
            console.error("Database Insert error: " +JSON.stringify(err));
            callback(rtn);
        }        
    });
};

exports.get = function (query, args, callback) {    
    pool.query(query, args, function (err, result) {
        if (!err && result) {  
            console.log("found data: " + JSON.stringify(result))
            callback(result);
        }else{
            console.error("Database get error: " +JSON.stringify(err));
            callback(result);
        }        
    });
};

exports.update = function (query, args, callback) {    
    pool.query(query, args, function (err, result) {
        if (!err && result) {            
            callback(result);
        }else{
            console.error("Database update error: " +JSON.stringify(err));
            callback(result);
        }        
    });
};


exports.delete = function (query, args, callback) {    
    pool.query(query, args, function (err, result) {
        if (!err && result) {  
            console.log("deleted rows: " + JSON.stringify(result))            
            callback(result);
        }else{
            console.error("Database delete error: " +JSON.stringify(err));
            callback(result);
        }        
    });
};








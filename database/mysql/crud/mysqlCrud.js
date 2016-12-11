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
    var rtn = {
        id : -1,
        success: false,
        message: ""
    };
    pool.query(query, args, function (err, result) {
        console.log("result in mysqlCrud: " + JSON.stringify(result))
        if (!err && result.insertId) {
            rtn.id = result.insertId;
            rtn.success = true;
            callback(rtn);
        }else{
            console.error("Database Insert error: " +JSON.stringify(err));
            rtn.message = "Database Insert failed."
            callback(rtn);
        }        
    });
};

exports.get = function (query, args, callback) {   
    var rtn = {
        success: false,
        message: "",
        data: null
    }
    pool.query(query, args, function (err, result) {
        if (!err && result) {  
            console.log("found data: " + JSON.stringify(result))
            rtn.success = true;
            rtn.data = result;
            callback(rtn);
        }else{
            console.error("Database get error: " +JSON.stringify(err));
            rtn.message = "Database get failed"
            callback(rtn);
        }        
    });
};

exports.update = function (query, args, callback) { 
    var rtn = {
        success: false,
        message: ""
    };
    pool.query(query, args, function (err, result) {
        if (!err && result.affectedRows && result.affectedRows > 0) { 
            rtn.success = true;
            callback(rtn);
        }else{
            console.error("Database update error: " +JSON.stringify(err));
            rtn.message = "Dababase update failed."
            callback(rtn);
        }        
    });
};


exports.delete = function (query, args, callback) {  
    var rtn = {
        success: false,
        message: ""
    };
    pool.query(query, args, function (err, result) {
        if (!err && result.affectedRows && result.affectedRows > 0) {  
            console.log("deleted rows: " + JSON.stringify(result))            
            rtn.success = true;
            callback(rtn);
        }else{
            console.error("Database delete error: " +JSON.stringify(err));
            rtn.message = "Dababase delete failed."
            callback(rtn);
        }        
    });
};








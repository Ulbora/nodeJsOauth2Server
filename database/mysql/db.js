var crud = require("./crud/mysqlCrud");
var clientQueries = require("./queries/clientQueries");
exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
};

exports.testConnection = function (callback) {
    crud.testConnection(callback);
};

exports.addClient = function(args, callback){    
    crud.insert(clientQueries.CLIENT_INSERT_QUERY, args, callback);
};



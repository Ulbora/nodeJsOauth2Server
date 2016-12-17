var tokenQueries = require("../queries/tokenQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//client allowed URI --------------------------
exports.addRefreshToken = function (json, callback) {
    var args = {
        token: json.token
    };
    crud.insert(tokenQueries.REFRESH_TOKEN_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getRefreshToken = function (id, callback) {
    var queryId = [id];
    crud.get(tokenQueries.REFRESH_TOKEN_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 && result.data[0].token.length > 0) {
            var rtn = {
                id: result.data[0].id,
                token: result.data[0].token.toString()
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteRefreshToken = function (id, callback) {
    var queryId = [id];
    crud.delete(tokenQueries.REFRESH_TOKEN_DELETE_QUERY, queryId, callback);
};



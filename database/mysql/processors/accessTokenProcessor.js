var tokenQueries = require("../queries/tokenQueries");
var crud;
exports.init = function(c){
    crud = c;
};

//access token --------------------------
exports.addAccessToken = function (json, callback) {
    var args = {
        token: json.token,
        expires: json.expires,
        refresh_token_id: json.refreshTokenId
    };
    console.log("json in add access token :" + JSON.stringify(json));
    crud.insert(tokenQueries.ACCESS_TOKEN_INSERT_QUERY, args, function (result) {
        var rtn = {
            id: result.id,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};


exports.getAccessToken = function (id, callback) {
    var queryId = [id];
    crud.get(tokenQueries.ACCESS_TOKEN_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get refresh token:" +JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 && result.data[0].token.length > 0) {
            var rtn = {
                id: result.data[0].id,
                token: result.data[0].token.toString(),
                expires: result.data[0].expires,
                refreshTokenId: result.data[0].refresh_token_id
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.deleteAccessToken = function (id, callback) {
    var queryId = [id];
    crud.delete(tokenQueries.ACCESS_TOKEN_DELETE_QUERY, queryId, callback);
};



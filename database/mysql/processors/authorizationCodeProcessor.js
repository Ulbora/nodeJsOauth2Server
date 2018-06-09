/*     
 Copyright (C) 2016 Ulbora Labs LLC. (www.ulboralabs.com)
 All rights reserved.
 
 Copyright (C) 2016 Ken Williamson
 All rights reserved.
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published
 by the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var authorizationCodeQueries = require("../queries/authorizationCodeQueries");
var crud;
exports.init = function (c) {
    crud = c;
};

//access token --------------------------
exports.addAuthorizationCode = function (con, json, callback) {
    var args = {
        client_id: json.clientId,
        user_id: json.userId,
        expires: json.expires,
        access_token_id: json.accessTokenId,
        randon_auth_code: json.randonAuthCode,
        already_used: json.alreadyUsed
    };
    //console.log("json in add authorizationCode :" + JSON.stringify(json));
    crud.insert(con, authorizationCodeQueries.AUTHORIZATION_CODE_INSERT_QUERY, args, function (result) {
        var rtn = {
            authorizationCode: result.id,
            codeString: json.randonAuthCode,
            success: result.success,
            message: result.message
        };
        callback(rtn);
    });
};

exports.updateAuthorizationCode = function (con, json, callback) {
    var args = [
        json.randonAuthCode,
        json.alreadyUsed,
        json.authorizationCode
    ];
    crud.update(con, authorizationCodeQueries.AUTHORIZATION_CODE_UPDATE_QUERY, args, callback);
};

exports.updateAuthorizationCodeToken = function (con, json, callback) {
    var args = [           
        json.expires,
        json.authorizationCode
    ];
    crud.update(con, authorizationCodeQueries.AUTHORIZATION_CODE_TOKEN_UPDATE_QUERY, args, callback);
};

exports.getAuthorizationCode = function (clientId, userId, callback) {
    var queryId = [clientId, userId];
    //console.log("getAuthorizationCode clientId: " + clientId + " userId: " + userId);
    crud.get(authorizationCodeQueries.AUTHORIZATION_CODE_GET_BY_ID_QUERY, queryId, function (result) {
        //console.log("get authorization code in processor:" + JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0) {
            var used = (result.data[0].already_used === 0)? false: true;
            var rtn = {                
                authorizationCode: result.data[0].authorization_code,
                clientId: result.data[0].client_id,
                userId: result.data[0].user_id,
                expires: result.data[0].expires,
                accessTokenId: result.data[0].access_token_id,
                codeString: result.data[0].randon_auth_code,
                alreadyUsed: used
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.getAuthorizationCodeByCode = function (code, callback) {
    var queryId = [code];
    //console.log("getAuthorizationCode code: " + code );
    crud.get(authorizationCodeQueries.AUTHORIZATION_CODE_GET_BY_CODE_QUERY, queryId, function (result) {
        //console.log("get authorization code by code in processor:" + JSON.stringify(result));
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0) {
            var used = (result.data[0].already_used === 0)? false: true;
            var rtn = {
                authorizationCode: result.data[0].authorization_code,
                clientId: result.data[0].client_id,
                userId: result.data[0].user_id,
                expires: result.data[0].expires,
                accessTokenId: result.data[0].access_token_id,
                codeString: result.data[0].randon_auth_code,
                alreadyUsed: used
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

exports.getAuthorizationCodeByScope = function (clientId, userId, scope, callback) {
    var queryId = [clientId, userId, scope];
    //console.log("getAuthorizationCodeByScope clientId: " + clientId + " userId: " + userId + "scope: " + scope);
    crud.get(authorizationCodeQueries.AUTHORIZATION_CODE_GET_BY_SCOPE_QUERY, queryId, function (result) {
        //console.log("get authorization code by scope in processor:" + JSON.stringify(result));
        var rtn = {
            authorized: false
        };
        //console.log("get refresh token value:" + result.data[0].token);
        //console.log("get refresh token length:" + result.data[0].token.length);
        if (result.success && result.data.length > 0 && result.data.length > 0 && result.data[0].authorization_code) {
            rtn.authorized = true;
            callback(rtn);
        } else {
            callback(null);
        }
    });
};

/*
 exports.getAuthorizationCodeWithTran = function (con, clientId, userId, callback) {
 var queryId = [clientId, userId];
 console.log("getAuthorizationCode clientId: " + clientId + " userId: " + userId);
 crud.getWithTran(con, authorizationCodeQueries.AUTHORIZATION_CODE_GET_BY_ID_QUERY, queryId, function (result) {
 console.log("get authorization code in processor:" +JSON.stringify(result));
 //console.log("get refresh token value:" + result.data[0].token);
 //console.log("get refresh token length:" + result.data[0].token.length);
 if (result.success && result.data.length > 0 ) {
 var rtn = {
 authorizationCode: result.data[0].authorization_code,
 clientId: result.data[0].client_id,
 userId: result.data[0].user_id,
 expires: result.data[0].expires,
 accessTokenId: result.data[0].access_token_id
 };
 callback(rtn);
 } else {
 callback(null);
 }
 });
 };
 */
exports.deleteAuthorizationCode = function (con, clientId, userId, callback) {
    var queryId = [clientId, userId];
    crud.delete(con, authorizationCodeQueries.AUTHORIZATION_CODE_DELETE_QUERY, queryId, callback);
};



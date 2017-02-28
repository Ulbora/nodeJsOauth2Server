/*     
 Copyright (C) 2016 Ulbora Labs Inc. (www.ulboralabs.com)
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

var crud = require("./crud/mysqlCrud");
var clientProcessor = require("./processors/clientProcessor");
var clientAllowedUriProcessor = require("./processors/clientAllowedUriProcessor");
var clientRedirectUriProcessor = require("./processors/clientRedirectUriProcessor");
var clientRoleProcessor = require("./processors/clientRoleProcessor");
var clientGrantTypeProcessor = require("./processors/clientGrantTypeProcessor");
var clientScopeProcessor = require("./processors/clientScopeProcessor");
var clientRoleUriProcessor = require("./processors/clientRoleUriProcessor");
var refreshTokenProcessor = require("./processors/refreshTokenProcessor");
var accessTokenProcessor = require("./processors/accessTokenProcessor");
var authorizationCodeProcessor = require("./processors/authorizationCodeProcessor");
var authorizationCodeScopeProcessor = require("./processors/authorizationCodeScopeProcessor");
var implicitGrantProcessor = require("./processors/implicitGrantProcessor");
var implicitGrantScopeProcessor = require("./processors/implicitGrantScopeProcessor");
var passwordGrantProcessor = require("./processors/passwordGrantProcessor");
var credentialsGrantProcessor = require("./processors/credentialsGrantProcessor");
var tokenKeyProcessor = require("./processors/tokenKeyProcessor");
var sessionKeyProcessor = require("./processors/sessionKeyProcessor");
var authCodeRevokeProcessor = require("./processors/authCodeRevokeProcessor");

exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
    clientProcessor.init(crud);
    clientRedirectUriProcessor.init(crud);
    clientAllowedUriProcessor.init(crud);
    clientRoleProcessor.init(crud);
    clientGrantTypeProcessor.init(crud);
    clientScopeProcessor.init(crud);
    clientRoleUriProcessor.init(crud);
    refreshTokenProcessor.init(crud);
    accessTokenProcessor.init(crud);
    authorizationCodeProcessor.init(crud);
    authorizationCodeScopeProcessor.init(crud);
    implicitGrantProcessor.init(crud);
    implicitGrantScopeProcessor.init(crud);
    passwordGrantProcessor.init(crud);
    credentialsGrantProcessor.init(crud);
    tokenKeyProcessor.init(crud);
    sessionKeyProcessor.init(crud);
    authCodeRevokeProcessor.init(crud);
};
// for testing only
exports.testConnection = function (callback) {
    crud.testConnection(callback);
};

// for testing only
exports.getConnection = function (callback) {
    crud.getConnection(callback);
};

//client operations---------------------------------------
exports.addClient = function (clientJson, redirectUrls, callback) {
    var rtn = {
        clientId: null,
        success: false,
        message: null
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    var insertedUri = 0;
                    clientProcessor.addClient(con, clientJson, function (clientResult) {
                        if (clientResult && clientResult.clientId > 0 && clientResult.success) {
                            if (redirectUrls && redirectUrls.length > 0) {
                                for (var cnt = 0; cnt < redirectUrls.length; cnt++) {
                                    var redUriJson = redirectUrls[cnt];
                                    redUriJson.clientId = clientResult.clientId;
                                    clientRedirectUriProcessor.addClientRedirectUri(con, redUriJson, function (uriResult) {
                                        if (uriResult && uriResult.id > 0) {
                                            insertedUri++;
                                            if (insertedUri === redirectUrls.length) {
                                                con.commit(function (err) {
                                                    if (err) {
                                                        con.rollback();
                                                    } else {
                                                        rtn.success = true;
                                                        rtn.clientId = clientResult.clientId;
                                                    }
                                                    con.release();
                                                    callback(rtn);
                                                });
                                            }
                                        } else {
                                            con.rollback();
                                            con.release();
                                            callback(rtn);
                                        }
                                    });
                                }
                            } else {
                                con.commit(function (err) {
                                    if (err) {
                                        con.rollback();
                                    } else {
                                        rtn.success = true;
                                        rtn.clientId = clientResult.clientId;
                                    }
                                    con.release();
                                    callback(rtn);
                                });
                            }
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });

};

exports.updateClient = function (json, callback) {
    clientProcessor.updateClient(null, json, callback);
};

exports.getClient = function (clientId, callback) {
    clientProcessor.getClient(clientId, callback);
};

exports.getClientList = function (callback) {
    clientProcessor.getClientList(callback);
};

exports.deleteClient = function (clientId, callback) {
    var rtn = {
        success: false,
        message: ""
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    clientRedirectUriProcessor.deleteAllClientRedirectUri(con, clientId, function (uriDelResult) {
                        if (uriDelResult.success) {
                            clientProcessor.deleteClient(con, clientId, function (clientDelResult) {
                                if (clientDelResult.success) {
                                    con.commit(function (err) {
                                        if (err) {
                                            con.rollback();
                                        } else {
                                            rtn.success = true;
                                        }
                                        con.release();
                                        callback(rtn);
                                    });
                                } else {
                                    con.rollback();
                                    con.release();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};
//end client operations ---------------------------------


//client allowed URI --------------------------
exports.addClientAllowedUri = function (json, callback) {
    clientAllowedUriProcessor.addClientAllowedUri(null, json, callback);
};

exports.updateClientAllowedUri = function (json, callback) {
    clientAllowedUriProcessor.updateClientAllowedUri(null, json, callback);
};

exports.getClientAllowedUriById = function (id, callback) {
    clientAllowedUriProcessor.getClientAllowedUriById(id, callback);
};

exports.getClientAllowedUriList = function (clientId, callback) {
    clientAllowedUriProcessor.getClientAllowedUriList(clientId, callback);
};

exports.getClientAllowedUri = function (clientId, uri, callback) {
    clientAllowedUriProcessor.getClientAllowedUri(clientId, uri, callback);
};

exports.deleteClientAllowedUri = function (id, callback) {
    clientAllowedUriProcessor.deleteClientAllowedUri(null, id, callback);
};
// end client allowed URI ------------------------------

//client redirect uri
exports.addClientRedirectUri = function (json, callback) {
    clientRedirectUriProcessor.addClientRedirectUri(null, json, callback);
};

exports.getClientRedirectUriList = function (clientId, callback) {
    clientRedirectUriProcessor.getClientRedirectUriList(clientId, callback);
};

exports.getClientRedirectUri = function (clientId, uri, callback) {
    clientRedirectUriProcessor.getClientRedirectUri(clientId, uri, callback);
};

exports.deleteClientRedirectUri = function (id, callback) {
    clientRedirectUriProcessor.deleteClientRedirectUri(null, id, callback);
};

exports.deleteAllClientRedirectUri = function (clientId, callback) {
    clientRedirectUriProcessor.deleteAllClientRedirectUri(null, clientId, callback);
};
//end client redirect uri


//client role
exports.addClientRole = function (json, callback) {
    clientRoleProcessor.addClientRole(null, json, callback);
};

exports.getClientRoleList = function (clientId, callback) {
    clientRoleProcessor.getClientRoleList(clientId, callback);
};

exports.deleteClientRole = function (id, callback) {
    clientRoleProcessor.deleteClientRole(null, id, callback);
};
//end client role

//client scope
exports.addClientScope = function (json, callback) {
    clientScopeProcessor.addClientScope(null, json, callback);
};

exports.getClientScopeList = function (clientId, callback) {
    clientScopeProcessor.getClientScopeList(clientId, callback);
};

exports.deleteClientScope = function (id, callback) {
    clientScopeProcessor.deleteClientScope(null, id, callback);
};
//end client scope

//client role uri
exports.addClientRoleUri = function (json, callback) {
    clientRoleUriProcessor.addClientRoleUri(null, json, callback);
};

exports.getClientRoleAllowedUriList = function (clientRoleId, callback) {
    clientRoleUriProcessor.getClientRoleAllowedUriList(clientRoleId, callback);
};

exports.getClientRoleAllowedUriListByClientId = function (clientId, callback) {
    clientRoleUriProcessor.getClientRoleAllowedUriListByClientId(clientId, callback);
};

exports.deleteClientRoleUri = function (json, callback) {
    clientRoleUriProcessor.deleteClientRoleUri(null, json, callback);
};
//end client role uri

//client grant types
//-------------------------------------------------------------------
//end client grant types

//refresh token
exports.addRefreshToken = function (json, callback) {
    refreshTokenProcessor.addRefreshToken(null, json, callback);
};

exports.updateRefreshToken = function (json, callback) {
    refreshTokenProcessor.updateRefreshToken(null, json, callback);
};

exports.getRefreshToken = function (id, callback) {
    refreshTokenProcessor.getRefreshToken(id, callback);
};

exports.deleteRefreshToken = function (id, callback) {
    refreshTokenProcessor.deleteRefreshToken(null, id, callback);
};
//end refresh token

//access token
exports.addAccessToken = function (json, callback) {
    accessTokenProcessor.addAccessToken(null, json, callback);
};

exports.updateAccessToken = function (json, callback) {
    accessTokenProcessor.updateAccessToken(null, json, callback);
};

exports.getAccessToken = function (id, callback) {
    accessTokenProcessor.getAccessToken(id, callback);
};

exports.deleteAccessToken = function (id, callback) {
    accessTokenProcessor.deleteAccessToken(null, id, callback);
};
//end access token

//authorization code
exports.addAuthorizationCode = function (authCodeJson, accessTokenJson, refreshTokenJson, scopeList, callback) {
    var rtn = {
        authorizationCode: null,
        codeString: null,
        success: false,
        message: null
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    if (refreshTokenJson) {
                        refreshTokenProcessor.addRefreshToken(con, refreshTokenJson, function (refreshResult) {
                            console.log("refresh token: " + JSON.stringify(refreshResult));
                            if (refreshResult.id > -1) {
                                var accTokenJson = accessTokenJson;
                                accTokenJson.refreshTokenId = refreshResult.id;
                                doAuthCodeAdd(con, rtn, authCodeJson, accTokenJson, scopeList, function (acRtn) {
                                    callback(acRtn);
                                });
                            } else {
                                con.rollback();
                                con.release();
                                callback(rtn);
                            }
                        });
                    } else {
                        doAuthCodeAdd(con, rtn, authCodeJson, accessTokenJson, scopeList, function (acRtn) {
                            callback(acRtn);
                        });
                    }
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};

var doAuthCodeAdd = function (con, rtn, authCodeJson, accTokenJson, scopeList, callback) {
    accessTokenProcessor.addAccessToken(con, accTokenJson, function (accessResult) {
        console.log("access token: " + JSON.stringify(accessResult));
        console.log("authCodeJson: " + JSON.stringify(authCodeJson));
        if (accessResult.id > -1) {
            var acJson = authCodeJson;
            //acJson.expires = accTokenJson.expires;
            acJson.accessTokenId = accessResult.id;
            authorizationCodeProcessor.addAuthorizationCode(con, acJson, function (acResult) {
                if (acResult.authorizationCode > -1) {
                    if (scopeList && scopeList.length > 0) {
                        var scopeCnt = 0;
                        for (var cnt = 0; cnt < scopeList.length; cnt++) {
                            var scopeJson = {
                                scope: scopeList[cnt],
                                authorizationCode: acResult.authorizationCode
                            };
                            authorizationCodeScopeProcessor.addAuthorizationCodeScope(con, scopeJson, function (scopeInsResult) {
                                if (scopeInsResult.success) {
                                    scopeCnt++;
                                } else {
                                    con.rollback();
                                    con.release();
                                    callback(rtn);
                                }
                                //console.log("scopeCnt === scopeList.length: " + (scopeCnt === scopeList.length));
                                if (scopeCnt === scopeList.length) {
                                    con.commit(function (err) {
                                        //console.log("commetting auth code add");
                                        if (err) {
                                            con.rollback();
                                        } else {
                                            rtn.authorizationCode = acResult.authorizationCode;
                                            rtn.codeString = acResult.codeString;
                                            rtn.success = true;
                                        }
                                        con.release();
                                        callback(rtn);
                                    });
                                }
                            });
                        }
                    } else {
                        con.commit(function (err) {
                            if (err) {
                                con.rollback();
                            } else {
                                rtn.authorizationCode = acResult.authorizationCode;
                                rtn.codeString = acResult.codeString;
                                rtn.success = true;
                            }
                            con.release();
                            callback(rtn);
                        });
                    }
                } else {
                    con.rollback();
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            con.rollback();
            con.release();
            callback(rtn);
        }
    });
};

exports.updateAuthorizationCodeAndTokens = function (authCodeJson, accessTokenJson, callback) {
    var rtn = {
        success: false,
        message: null
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    doAuthCodeUpdate(con, rtn, authCodeJson, accessTokenJson, function (acRtn) {
                        callback(acRtn);
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};

var doAuthCodeUpdate = function (con, rtn, authCodeJson, accTokenJson, callback) {
    accessTokenProcessor.updateAccessToken(con, accTokenJson, function (accessResult) {
        console.log("access token: " + JSON.stringify(accessResult));
        console.log("authCodeJson: " + JSON.stringify(authCodeJson));
        if (accessResult.success) {
            authorizationCodeProcessor.updateAuthorizationCodeToken(con, authCodeJson, function (acResult) {
                if (acResult.success) {
                    con.commit(function (err) {
                        //console.log("commetting auth code add");
                        if (err) {
                            con.rollback();
                        } else {
                            rtn.success = true;
                        }
                        con.release();
                        callback(rtn);
                    });
                } else {
                    con.rollback();
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            con.rollback();
            con.release();
            callback(rtn);
        }
    });
};

exports.getAuthorizationCode = function (clientId, userId, callback) {
    authorizationCodeProcessor.getAuthorizationCode(clientId, userId, callback);
};

exports.getAuthorizationCodeByCode = function (code, callback) {
    authorizationCodeProcessor.getAuthorizationCodeByCode(code, callback);
};

exports.getAuthorizationCodeByScope = function (clientId, userId, scope, callback) {
    authorizationCodeProcessor.getAuthorizationCodeByScope(clientId, userId, scope, callback);
};

exports.updateAuthorizationCode = function (json, callback) {
    authorizationCodeProcessor.updateAuthorizationCode(null, json, callback);
};

exports.deleteAuthorizationCode = function (clientId, userId, callback) {
    var rtn = {
        success: false,
        message: ""
    };
    console.log("starting connection in delete code clientId: " + clientId + " userId: " + userId);
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    console.log("starting transaction in delete code: ");
                    var refreshTokenId;
                    authorizationCodeProcessor.getAuthorizationCode(clientId, userId, function (acResult) {
                        console.log("getAuthorizationCode in delete: " + JSON.stringify(acResult));
                        if (acResult && acResult.accessTokenId) {
                            accessTokenProcessor.getAccessToken(acResult.accessTokenId, function (accTokenResult) {
                                if (accTokenResult && accTokenResult.refreshTokenId) {
                                    refreshTokenId = accTokenResult.refreshTokenId;
                                }
                                authCodeRevokeProcessor.deleteAuthCodeRevoke(null, acResult.authorizationCode, function (revokeResult) {
                                    if (revokeResult.success) {
                                        authorizationCodeScopeProcessor.deleteAuthorizationCodeScopeList(con, acResult.authorizationCode, function (scopeDelResult) {
                                            console.log("deleteAuthorizationCodeScopeList in delete: " + JSON.stringify(scopeDelResult));
                                            if (scopeDelResult.success) {
                                                authorizationCodeProcessor.deleteAuthorizationCode(con, clientId, userId, function (acDelResult) {
                                                    if (acDelResult.success) {
                                                        accessTokenProcessor.deleteAccessToken(con, acResult.accessTokenId, function (accTokenDelResult) {
                                                            console.log("deleteAccessToken in delete: " + JSON.stringify(accTokenDelResult));
                                                            if (accTokenDelResult.success) {
                                                                if (refreshTokenId) {
                                                                    refreshTokenProcessor.deleteRefreshToken(con, refreshTokenId, function (rfTokenDelResult) {
                                                                        if (rfTokenDelResult.success) {
                                                                            con.commit(function (err) {
                                                                                if (err) {
                                                                                    con.rollback();
                                                                                } else {
                                                                                    rtn.success = true;
                                                                                }
                                                                                con.release();
                                                                                callback(rtn);
                                                                            });
                                                                        } else {
                                                                            con.rollback();
                                                                            con.release();
                                                                            callback(rtn);
                                                                        }
                                                                    });
                                                                } else {
                                                                    con.commit(function (err) {
                                                                        if (err) {
                                                                            con.rollback();
                                                                        } else {
                                                                            rtn.success = true;
                                                                        }
                                                                        con.release();
                                                                        callback(rtn);
                                                                    });
                                                                }
                                                            } else {
                                                                con.rollback();
                                                                con.release();
                                                                callback(rtn);
                                                            }
                                                        });
                                                    } else {
                                                        con.rollback();
                                                        con.release();
                                                        callback(rtn);
                                                    }
                                                });
                                            } else {
                                                con.rollback();
                                                con.release();
                                                callback(rtn);
                                            }
                                        });
                                    } else {
                                        con.rollback();
                                        con.release();
                                        callback(rtn);
                                    }
                                });
                            });
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    console.log("error:" + JSON.stringify(err));
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            console.log("error:" + JSON.stringify(err));
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};
//end authorization code

//authorization code scope
exports.addAuthorizationCodeScope = function (json, callback) {
    authorizationCodeScopeProcessor.addAuthorizationCodeScope(null, json, callback);
};

exports.getAuthorizationCodeScopeList = function (authorizationCode, callback) {
    authorizationCodeScopeProcessor.getAuthorizationCodeScopeList(authorizationCode, callback);
};

exports.deleteAuthorizationCodeScope = function (id, callback) {
    authorizationCodeScopeProcessor.deleteAuthorizationCodeScope(null, id, callback);
};

exports.deleteAuthorizationCodeScopeList = function (authorizationCode, callback) {
    authorizationCodeScopeProcessor.deleteAuthorizationCodeScopeList(null, authorizationCode, callback);
};
//end authorization code scope

// allowed grant types
exports.addClientGrantType = function (json, callback) {
    clientGrantTypeProcessor.addClientGrantType(null, json, callback);
};

exports.getClientGrantTypeList = function (clientId, callback) {
    clientGrantTypeProcessor.getClientGrantTypeList(clientId, callback);
};

exports.deleteClientGrantType = function (id, callback) {
    clientGrantTypeProcessor.deleteClientGrantType(null, id, callback);
};
//end grant types

//implicit grant
//authorization code
exports.addImplicitGrant = function (implicitJson, accessTokenJson, scopeList, callback) {
    var rtn = {
        id: null,
        success: false,
        message: null
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    accessTokenProcessor.addAccessToken(con, accessTokenJson, function (accessResult) {
                        if (accessResult.id > -1) {
                            var impJson = implicitJson;
                            impJson.accessTokenId = accessResult.id;
                            implicitGrantProcessor.addImplicitGrant(con, impJson, function (impResult) {
                                if (impResult.id > -1) {
                                    //do for loop to all each scope---------------------
                                    if (scopeList && scopeList.length > 0) {
                                        var scopeCnt = 0;
                                        for (var cnt = 0; cnt < scopeList.length; cnt++) {
                                            var scopeJson = {
                                                scope: scopeList[cnt],
                                                implicitGrantId: impResult.id
                                            };
                                            implicitGrantScopeProcessor.addImplicitGrantScope(con, scopeJson, function (scopeInsResult) {
                                                if (scopeInsResult.success) {
                                                    scopeCnt++;
                                                } else {
                                                    con.rollback();
                                                    con.release();
                                                    callback(rtn);
                                                }
                                                //console.log("scopeCnt === scopeList.length: " + (scopeCnt === scopeList.length));
                                                if (scopeCnt === scopeList.length) {
                                                    con.commit(function (err) {
                                                        //console.log("commetting auth code add");
                                                        if (err) {
                                                            con.rollback();
                                                        } else {
                                                            rtn.id = impResult.id;
                                                            rtn.success = true;
                                                        }
                                                        con.release();
                                                        callback(rtn);
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        con.rollback();
                                        con.release();
                                        callback(rtn);
                                    }
                                } else {
                                    con.rollback();
                                    con.release();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};

exports.getImplicitGrant = function (clientId, userId, callback) {
    implicitGrantProcessor.getImplicitGrant(clientId, userId, callback);
};

exports.getImplicitGrantByScope = function (clientId, userId, scope, callback) {
    implicitGrantProcessor.getImplicitGrantByScope(clientId, userId, scope, callback);
};

exports.deleteImplicitGrant = function (clientId, userId, callback) {
    var rtn = {
        success: false,
        message: ""
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    implicitGrantProcessor.getImplicitGrant(clientId, userId, function (imResult) {
                        if (imResult && imResult.accessTokenId) {
                            implicitGrantScopeProcessor.deleteImplicitGrantScopeList(con, imResult.id, function (scopeResult) {
                                if (scopeResult.success) {
                                    implicitGrantProcessor.deleteImplicitGrant(con, clientId, userId, function (imDelResult) {
                                        if (imDelResult.success) {
                                            accessTokenProcessor.deleteAccessToken(con, imResult.accessTokenId, function (accTokenDelResult) {
                                                if (accTokenDelResult.success) {
                                                    con.commit(function (err) {
                                                        if (err) {
                                                            con.rollback();
                                                        } else {
                                                            rtn.success = true;
                                                        }
                                                        con.release();
                                                        callback(rtn);
                                                    });
                                                } else {
                                                    con.rollback();
                                                    con.release();
                                                    callback(rtn);
                                                }
                                            });
                                        } else {
                                            con.rollback();
                                            con.release();
                                            callback(rtn);
                                        }
                                    });
                                } else {
                                    con.rollback();
                                    con.release();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};
//end implicit grant

// implicit grant scope

exports.addImplicitGrantScope = function (json, callback) {
    implicitGrantScopeProcessor.addImplicitGrantScope(null, json, callback);
};

exports.getImplicitGrantScopeList = function (implicitGrantId, callback) {
    implicitGrantScopeProcessor.getImplicitGrantScopeList(implicitGrantId, callback);
};

exports.deleteImplicitGrantScope = function (id, callback) {
    implicitGrantScopeProcessor.deleteImplicitGrantScope(null, id, callback);
};

//end implicit scope

//password grant
//
//authorization code
exports.addPasswordGrant = function (pwgJson, accessTokenJson, refreshTokenJson, callback) {
    var rtn = {
        id: null,
        success: false,
        message: null
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    if (refreshTokenJson) {
                        refreshTokenProcessor.addRefreshToken(con, refreshTokenJson, function (refreshResult) {
                            if (refreshResult.id > -1) {
                                var accTokenJson = accessTokenJson;
                                accTokenJson.refreshTokenId = refreshResult.id;
                                doPwGrantAdd(con, rtn, pwgJson, accTokenJson, function (pwRtn) {
                                    callback(pwRtn);
                                });
                            } else {
                                con.rollback();
                                con.release();
                                callback(rtn);
                            }
                        });
                    } else {
                        doPwGrantAdd(con, rtn, pwgJson, accessTokenJson, function (acRtn) {
                            callback(acRtn);
                        });
                    }
                } else {
                    callback(rtn);
                }
            });
        } else {
            callback(rtn);
        }
    });
};

var doPwGrantAdd = function (con, rtn, pwgJson, accTokenJson, callback) {
    accessTokenProcessor.addAccessToken(con, accTokenJson, function (accessResult) {
        if (accessResult.id > -1) {
            var pJson = pwgJson;
            pJson.accessTokenId = accessResult.id;
            passwordGrantProcessor.addPasswordGrant(con, pJson, function (pwResult) {
                if (pwResult.id > -1) {
                    con.commit(function (err) {
                        if (err) {
                            con.rollback();
                        } else {
                            rtn.id = pwResult.id;
                            rtn.success = true;
                        }
                        con.release();
                        callback(rtn);
                    });
                } else {
                    con.rollback();
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            con.rollback();
            con.release();
            callback(rtn);
        }
    });
};

exports.getPasswordGrant = function (clientId, userId, callback) {
    passwordGrantProcessor.getPasswordGrant(clientId, userId, callback);
};

exports.deletePasswordGrant = function (clientId, userId, callback) {
    var rtn = {
        success: false,
        message: ""
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    var refreshTokenId;
                    passwordGrantProcessor.getPasswordGrant(clientId, userId, function (pwResult) {
                        if (pwResult && pwResult.accessTokenId) {
                            accessTokenProcessor.getAccessToken(pwResult.accessTokenId, function (accTokenResult) {
                                if (accTokenResult && accTokenResult.refreshTokenId) {
                                    refreshTokenId = accTokenResult.refreshTokenId;
                                }
                                passwordGrantProcessor.deletePasswordGrant(con, clientId, userId, function (pwDelResult) {
                                    if (pwDelResult.success) {
                                        accessTokenProcessor.deleteAccessToken(con, pwResult.accessTokenId, function (accTokenDelResult) {
                                            if (accTokenDelResult.success) {
                                                if (refreshTokenId) {
                                                    refreshTokenProcessor.deleteRefreshToken(con, refreshTokenId, function (rfTokenDelResult) {
                                                        if (rfTokenDelResult.success) {
                                                            con.commit(function (err) {
                                                                if (err) {
                                                                    con.rollback();
                                                                } else {
                                                                    rtn.success = true;
                                                                }
                                                                con.release();
                                                                callback(rtn);
                                                            });
                                                        } else {
                                                            con.rollback();
                                                            con.release();
                                                            callback(rtn);
                                                        }
                                                    });
                                                } else {
                                                    con.commit(function (err) {
                                                        if (err) {
                                                            con.rollback();
                                                        } else {
                                                            rtn.success = true;
                                                        }
                                                        con.release();
                                                        callback(rtn);
                                                    });
                                                }
                                            } else {
                                                con.rollback();
                                                con.release();
                                                callback(rtn);
                                            }
                                        });
                                    } else {
                                        con.rollback();
                                        con.release();
                                        callback(rtn);
                                    }
                                });
                            });
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};
//end password grant

//credentials code
exports.addCredentialsGrant = function (credJson, accessTokenJson, callback) {
    var rtn = {
        id: null,
        success: false,
        message: null
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    accessTokenProcessor.addAccessToken(con, accessTokenJson, function (accessResult) {
                        if (accessResult.id > -1) {
                            var cJson = credJson;
                            cJson.accessTokenId = accessResult.id;
                            credentialsGrantProcessor.addCredentialsGrant(con, cJson, function (impResult) {
                                if (impResult.id > -1) {
                                    con.commit(function (err) {
                                        if (err) {
                                            con.rollback();
                                        } else {
                                            rtn.id = impResult.id;
                                            rtn.success = true;
                                        }
                                        con.release();
                                        callback(rtn);
                                    });
                                } else {
                                    con.rollback();
                                    con.release();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            con.release();
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};

exports.getCredentialsGrant = function (clientId, callback) {
    credentialsGrantProcessor.getCredentialsGrant(clientId, callback);
};


exports.deleteCredentialsGrant = function (clientId, callback) {
    var rtn = {
        success: false,
        message: ""
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    credentialsGrantProcessor.getCredentialsGrant(clientId, function (imResult) {
                        if (imResult && imResult.accessTokenId) {
                            credentialsGrantProcessor.deleteCredentialsGrant(con, clientId, function (imDelResult) {
                                if (imDelResult.success) {
                                    accessTokenProcessor.deleteAccessToken(con, imResult.accessTokenId, function (accTokenDelResult) {
                                        if (accTokenDelResult.success) {
                                            con.commit(function (err) {
                                                if (err) {
                                                    con.rollback();
                                                } else {
                                                    rtn.success = true;
                                                }
                                                con.release();
                                                callback(rtn);
                                            });
                                        } else {
                                            con.rollback();
                                            con.release();
                                            callback(rtn);
                                        }
                                    });
                                } else {
                                    con.rollback();
                                    con.release();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            con.release();
                            rtn.success = true;
                            callback(rtn);
                        }
                    });
                } else {
                    con.release();
                    callback(rtn);
                }
            });
        } else {
            if (con) {
                con.release();
            }
            callback(rtn);
        }
    });
};
//end credentials grant

//token keys

exports.getAccessTokenKey = function (callback) {
    tokenKeyProcessor.getAccessTokenKey(callback);
};


exports.getRefreshTokenKey = function (callback) {
    tokenKeyProcessor.getRefreshTokenKey(callback);
};
//end token keys

exports.getSessionKey = function (callback) {
    sessionKeyProcessor.getSessionKey(callback);
};

exports.getSessionStore = function (session, callback) {
    var MySQLStore = require('express-mysql-session')(session);
    crud.getConnection(function (err, con) {
        var sessionStore;
        if (!err && con) {
            sessionStore = new MySQLStore({}, con);
            callback(sessionStore);
        } else {
            if (con) {
                con.release();
            }
            callback(sessionStore);
        }
    });
};

// allowed addAuthCodeRevoke
exports.addAuthCodeRevoke = function (json, callback) {
    authCodeRevokeProcessor.addAuthCodeRevoke(null, json, callback);
};

exports.getAuthCodeRevoke = function (authCode, callback) {
    authCodeRevokeProcessor.getAuthCodeRevoke(authCode, callback);
};

exports.deleteAuthCodeRevoke = function (authCode, callback) {
    authCodeRevokeProcessor.deleteAuthCodeRevoke(null, authCode, callback);
};
//end addAuthCodeRevoke
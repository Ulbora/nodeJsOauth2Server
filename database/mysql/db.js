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
var clientRoleProcessor = require("./processors/clientRoleProcessor");
var clientGrantTypeProcessor = require("./processors/clientGrantTypeProcessor");
var clientScopeProcessor = require("./processors/clientScopeProcessor");
var clientRoleUriProcessor = require("./processors/clientRoleUriProcessor");
var refreshTokenProcessor = require("./processors/refreshTokenProcessor");
var accessTokenProcessor = require("./processors/accessTokenProcessor");
var authorizationCodeProcessor = require("./processors/authorizationCodeProcessor");
var authorizationCodeScopeProcessor = require("./processors/authorizationCodeScopeProcessor");
var implicitGrantProcessor = require("./processors/implicitGrantProcessor");

exports.connect = function (host, user, pw, db, cpnum) {
    crud.connect(host, user, pw, db, cpnum);
    clientProcessor.init(crud);
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
exports.addClient = function (con, json, callback) {
    clientProcessor.addClient(con, json, callback);
};

exports.updateClient = function (con, json, callback) {
    clientProcessor.updateClient(con, json, callback);
};

exports.getClient = function (clientId, callback) {
    clientProcessor.getClient(clientId, callback);
};

exports.getClientList = function (callback) {
    clientProcessor.getClientList(callback);
};

exports.deleteClient = function (con, clientId, callback) {
    clientProcessor.deleteClient(con, clientId, callback);
};
//end client operations ---------------------------------


//client allowed URI --------------------------
exports.addClientAllowedUri = function (con, json, callback) {
    clientAllowedUriProcessor.addClientAllowedUri(con, json, callback);
};

exports.getClientAllowedUriList = function (clientId, callback) {
    clientAllowedUriProcessor.getClientAllowedUriList(clientId, callback);
};

exports.deleteClientAllowedUri = function (con, id, callback) {
    clientAllowedUriProcessor.deleteClientAllowedUri(con, id, callback);
};
// end client allowed URI ------------------------------

//client role
exports.addClientRole = function (con, json, callback) {
    clientRoleProcessor.addClientRole(con, json, callback);
};

exports.getClientRoleList = function (clientId, callback) {
    clientRoleProcessor.getClientRoleList(clientId, callback);
};

exports.deleteClientRole = function (con, id, callback) {
    clientRoleProcessor.deleteClientRole(con, id, callback);
};
//end client role

//client scope
exports.addClientScope = function (con, json, callback) {
    clientScopeProcessor.addClientScope(con, json, callback);
};

exports.getClientScopeList = function (clientId, callback) {
    clientScopeProcessor.getClientScopeList(clientId, callback);
};

exports.deleteClientScope = function (con, id, callback) {
    clientScopeProcessor.deleteClientScope(con, id, callback);
};
//end client scope

//client role uri
exports.addClientRoleUri = function (con, json, callback) {
    clientRoleUriProcessor.addClientRoleUri(con, json, callback);
};

exports.getClientRoleAllowedUriList = function (clientRoleId, callback) {
    clientRoleUriProcessor.getClientRoleAllowedUriList(clientRoleId, callback);
};

exports.deleteClientRoleUri = function (con, json, callback) {
    clientRoleUriProcessor.deleteClientRoleUri(con, json, callback);
};
//end client role uri

//client grant types
//-------------------------------------------------------------------
//end client grant types

//refresh token
exports.addRefreshToken = function (con, json, callback) {
    refreshTokenProcessor.addRefreshToken(con, json, callback);
};

exports.updateRefreshToken = function (con, json, callback) {
    refreshTokenProcessor.updateRefreshToken(con, json, callback);
};

exports.getRefreshToken = function (id, callback) {
    refreshTokenProcessor.getRefreshToken(id, callback);
};

exports.deleteRefreshToken = function (con, id, callback) {
    refreshTokenProcessor.deleteRefreshToken(con, id, callback);
};
//end refresh token

//access token
exports.addAccessToken = function (con, json, callback) {
    accessTokenProcessor.addAccessToken(con, json, callback);
};

exports.updateAccessToken = function (con, json, callback) {
    accessTokenProcessor.updateAccessToken(con, json, callback);
};

exports.getAccessToken = function (id, callback) {
    accessTokenProcessor.getAccessToken(id, callback);
};

exports.deleteAccessToken = function (con, id, callback) {
    accessTokenProcessor.deleteAccessToken(con, id, callback);
};
//end access token

//authorization code
exports.addAuthorizationCode = function (authCodeJson, accessTokenJson, refreshTokenJson, callback) {
    var rtn = {
        authorizationCode: null,
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
                                doAuthCodeAdd(con, rtn, authCodeJson, accTokenJson, function (acRtn) {
                                    callback(acRtn);
                                });
                            } else {
                                con.rollback();
                                callback(rtn);
                            }
                        });
                    } else {
                        doAuthCodeAdd(con, rtn, authCodeJson, accessTokenJson, function (acRtn) {
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

var doAuthCodeAdd = function (con, rtn, authCodeJson, accTokenJson, callback) {
    accessTokenProcessor.addAccessToken(con, accTokenJson, function (accessResult) {
        if (accessResult.id > -1) {
            var acJson = authCodeJson;
            acJson.expires = accTokenJson.expires;
            acJson.accessTokenId = accessResult.id;
            authorizationCodeProcessor.addAuthorizationCode(con, acJson, function (acResult) {
                if (acResult.authorizationCode > -1) {
                    con.commit(function (err) {
                        if (err) {
                            con.rollback();
                            callback(rtn);
                        } else {
                            rtn.authorizationCode = acResult.authorizationCode;
                            rtn.success = true;
                            callback(rtn);
                        }
                    });
                } else {
                    con.rollback();
                    callback(rtn);
                }
            });
        } else {
            con.rollback();
            callback(rtn);
        }
    });
};

exports.getAuthorizationCode = function (clientId, userId, callback) {
    authorizationCodeProcessor.getAuthorizationCode(clientId, userId, callback);
};

exports.updateAuthorizationCode = function (con, json, callback) {
    authorizationCodeProcessor.updateAuthorizationCode(con, json, callback);
};

exports.deleteAuthorizationCode = function (clientId, userId, callback) {
    var rtn = {
        success: false,
        message: ""
    };
    crud.getConnection(function (err, con) {
        if (!err && con) {
            con.beginTransaction(function (err) {
                if (!err) {
                    var refreshTokenId;
                    authorizationCodeProcessor.getAuthorizationCode(clientId, userId, function (acResult) {
                        if (acResult && acResult.accessTokenId) {
                            accessTokenProcessor.getAccessToken(acResult.accessTokenId, function (accTokenResult) {
                                if (accTokenResult && accTokenResult.refreshTokenId) {
                                    refreshTokenId = accTokenResult.refreshTokenId;
                                }
                                authorizationCodeProcessor.deleteAuthorizationCode(con, clientId, userId, function (acDelResult) {
                                    if (acDelResult.success) {
                                        accessTokenProcessor.deleteAccessToken(con, acResult.accessTokenId, function (accTokenDelResult) {
                                            if (accTokenDelResult.success) {
                                                if (refreshTokenId) {
                                                    refreshTokenProcessor.deleteRefreshToken(con, refreshTokenId, function (rfTokenDelResult) {
                                                        if (rfTokenDelResult.success) {
                                                            con.commit(function (err) {
                                                                if (err) {
                                                                    con.rollback();
                                                                    callback(rtn);
                                                                } else {
                                                                    rtn.success = true;
                                                                    callback(rtn);
                                                                }
                                                            });
                                                        } else {
                                                            con.rollback();
                                                            callback(rtn);
                                                        }
                                                    });
                                                } else {
                                                    con.commit(function (err) {
                                                        if (err) {
                                                            con.rollback();
                                                            callback(rtn);
                                                        } else {
                                                            rtn.success = true;
                                                            callback(rtn);
                                                        }
                                                    });
                                                }
                                            } else {
                                                con.rollback();
                                                callback(rtn);
                                            }
                                        });
                                    } else {
                                        con.rollback();
                                        callback(rtn);
                                    }
                                });
                            });
                        } else {
                            con.rollback();
                            callback(rtn);
                        }
                    });
                } else {
                    callback(rtn);
                }
            });
        } else {
            callback(rtn);
        }
    });
};
//end authorization code

//authorization code scope
exports.addAuthorizationCodeScope = function (con, json, callback) {
    authorizationCodeScopeProcessor.addAuthorizationCodeScope(con, json, callback);
};

exports.getAuthorizationCodeScopeList = function (authorizationCode, callback) {
    authorizationCodeScopeProcessor.getAuthorizationCodeScopeList(authorizationCode, callback);
};

exports.deleteAuthorizationCodeScope = function (con, id, callback) {
    authorizationCodeScopeProcessor.deleteAuthorizationCodeScope(con, id, callback);
};

exports.deleteAuthorizationCodeScopeList = function (con, authorizationCode, callback) {
    authorizationCodeScopeProcessor.deleteAuthorizationCodeScopeList(con, authorizationCode, callback);
};
//end authorization code scope

// allowed grant types
exports.addClientGrantType = function (con, json, callback) {
    clientGrantTypeProcessor.addClientGrantType(con, json, callback);
};

exports.getClientGrantTypeList = function (clientId, callback) {
    clientGrantTypeProcessor.getClientGrantTypeList(clientId, callback);
};

exports.deleteClientGrantType = function (con, id, callback) {
    clientGrantTypeProcessor.deleteClientGrantType(con, id, callback);
};
//end grant types

//implicit grant
//authorization code
exports.addImplicitGrant = function (implicitJson, accessTokenJson, callback) {
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
                            implicitGrantProcessor.addImplicitGrant(con, implicitJson, function (impResult) {
                                if (impResult.id > -1) {
                                    con.commit(function (err) {
                                        if (err) {
                                            con.rollback();
                                            callback(rtn);
                                        } else {
                                            rtn.id = impResult.id;
                                            rtn.success = true;
                                            callback(rtn);
                                        }
                                    });
                                } else {
                                    con.rollback();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            callback(rtn);
                        }
                    });
                } else {
                    callback(rtn);
                }
            });
        } else {
            callback(rtn);
        }
    });
};

exports.getImplicitGrant = function (clientId, userId, callback) {
    implicitGrantProcessor.getImplicitGrant(clientId, userId, callback);
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
                            implicitGrantProcessor.deleteImplicitGrant(con, clientId, userId, function (imDelResult) {
                                if (imDelResult.success) {
                                    accessTokenProcessor.deleteAccessToken(con, imResult.accessTokenId, function (accTokenDelResult) {
                                        if (accTokenDelResult.success) {
                                            con.commit(function (err) {
                                                if (err) {
                                                    con.rollback();
                                                    callback(rtn);
                                                } else {
                                                    rtn.success = true;
                                                    callback(rtn);
                                                }
                                            });
                                        } else {
                                            con.rollback();
                                            callback(rtn);
                                        }
                                    });
                                } else {
                                    con.rollback();
                                    callback(rtn);
                                }
                            });
                        } else {
                            con.rollback();
                            callback(rtn);
                        }
                    });
                } else {
                    callback(rtn);
                }
            });
        } else {
            callback(rtn);
        }
    });
};
//end implicit grant
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



var db;
var crypto = require('crypto');

exports.init = function (database) {
    db = database;
};


exports.securityCheck = function (obj) {
    var returnVal = true;
    if (obj !== undefined && obj !== null) {
        var json = JSON.stringify(obj);
        if (json !== undefined && json !== null) {
            var n = json.indexOf("function");
            if (n > -1) {
                console.log("Security Alert: " + json);
                returnVal = false;
            }
        } else {
            returnVal = false;
        }
    } else {
        returnVal = false;
    }
    return returnVal;
};


exports.generateClientSecret = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};


exports.grantTypeTurnedOn = function (clientId, grantType, callback) {
    var rtn = false;
    if (grantType) {
        db.getClientGrantTypeList(clientId, function (grantTypeList) {
            if (grantTypeList) {
                for (var cnt = 0; cnt < grantTypeList.length; cnt++) {
                    if (grantTypeList[cnt].grantType === grantType) {
                        rtn = true;
                        break;
                    }
                }
                callback(rtn);
            } else {
                callback(rtn);
            }
        });
    } else {
        callback(rtn);
    }
};


var shifter = 5;
exports.hashUser = function (username) {
    //var rtn = crypto.pbkdf2Sync(username, username, 250, 128);   
    //return rtn.toString('hex');
    var rtn = "";    
    if (username && username.length > 0) {
        for (var cnt = 0; cnt < username.length; cnt++) {
            var charcode = (username[cnt].charCodeAt()) + shifter;
            rtn += String.fromCharCode(charcode);
        }
    }
    return rtn;
};

exports.unHashUser = function (username) {
    var rtn = "";
    if (username && username.length > 0) {
        for (var cnt = 0; cnt < username.length; cnt++) {
            var charcode = (username[cnt].charCodeAt()) - shifter;
            rtn += String.fromCharCode(charcode);
        }
    } 
    return rtn;
};

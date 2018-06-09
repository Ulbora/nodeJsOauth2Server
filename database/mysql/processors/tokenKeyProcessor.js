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

var tokenKeyQueries = require("../queries/tokenKeyQueries");
var crud;
exports.init = function(c){
    crud = c;
};

exports.getAccessTokenKey = function (callback) {    
    crud.getList(tokenKeyQueries.ACCESS_TOKEN_KEY_GET_QUERY, function (result) {
       if (result.success && result.data.length > 0) {
            var rtn = {
                id: result.data[0].id,  
                key: result.data[0].key
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};


exports.getRefreshTokenKey = function (callback) {    
    crud.getList(tokenKeyQueries.REFRESH_TOKEN_KEY_GET_QUERY, function (result) {
       if (result.success && result.data.length > 0) {
            var rtn = {
                id: result.data[0].id,  
                key: result.data[0].key
            };
            callback(rtn);
        } else {
            callback(null);
        }
    });
};



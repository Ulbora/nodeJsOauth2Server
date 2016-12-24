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

exports.REFRESH_TOKEN_INSERT_QUERY = "INSERT INTO refresh_token Set ?";
exports.REFRESH_TOKEN_UPDATE_QUERY = "UPDATE refresh_token SET token = ? " +
                                     "WHERE id = ? ";
exports.REFRESH_TOKEN_GET_BY_ID_QUERY = "SELECT id, token FROM refresh_token WHERE id = ?";
exports.REFRESH_TOKEN_DELETE_QUERY = "DELETE FROM refresh_token WHERE id = ?";


exports.ACCESS_TOKEN_INSERT_QUERY = "INSERT INTO access_token Set ?";
exports.ACCESS_TOKEN_UPDATE_QUERY = "UPDATE access_token SET token = ?, expires = ?, refresh_token_id = ? " +
                                    "WHERE id = ? ";
exports.ACCESS_TOKEN_GET_BY_ID_QUERY = "SELECT id, token, expires, refresh_token_id FROM access_token WHERE id = ?";
exports.ACCESS_TOKEN_DELETE_QUERY = "DELETE FROM access_token WHERE id = ?";
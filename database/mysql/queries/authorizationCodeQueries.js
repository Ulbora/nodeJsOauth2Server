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

exports.AUTHORIZATION_CODE_INSERT_QUERY = "INSERT INTO authorization_code Set ?";
exports.AUTHORIZATION_CODE_GET_BY_ID_QUERY = "SELECT authorization_code, client_id, user_id, expires,  access_token_id, randon_auth_code, already_used " +
                                             "FROM authorization_code WHERE client_id = ? and user_id = ?";
exports.AUTHORIZATION_CODE_GET_BY_SCOPE_QUERY = "SELECT a.authorization_code, a.client_id, s.scope, a.randon_auth_code, a.already_used " +
                                                "FROM authorization_code a inner join auth_code_scope s " +
                                                "on a.authorization_code = s.authorization_code " +
                                                "WHERE a.client_id = ? and a.user_id = ? and s.scope = ?";                              
exports.AUTHORIZATION_CODE_UPDATE_QUERY = "UPDATE authorization_code SET randon_auth_code = ?, already_used = ? " +
                                          "WHERE authorization_code = ? ";
exports.AUTHORIZATION_CODE_DELETE_QUERY = "DELETE FROM authorization_code WHERE client_id = ? and user_id = ?";

exports.AUTHORIZATION_CODE_GET_BY_CODE_QUERY = "SELECT authorization_code, client_id, user_id, expires,  access_token_id, randon_auth_code, already_used " +
                                             "FROM authorization_code WHERE randon_auth_code = ?";
                            
exports.AUTHORIZATION_CODE_TOKEN_UPDATE_QUERY = "UPDATE authorization_code SET expires = ? " +
                                                "WHERE authorization_code = ? ";                           



exports.AUTHORIZATION_CODE_SCOPE_INSERT_QUERY = "INSERT INTO auth_code_scope Set ?";
exports.AUTHORIZATION_CODE_SCOPE_GET_BY_CODE_QUERY = "SELECT id, scope, authorization_code " +
        "FROM auth_code_scope WHERE authorization_code = ?";
exports.AUTHORIZATION_CODE_SCOPE_DELETE_QUERY = "DELETE FROM auth_code_scope WHERE id = ?";

exports.AUTHORIZATION_CODE_SCOPE_DELETE_ALL_QUERY = "DELETE FROM auth_code_scope WHERE authorization_code = ?";

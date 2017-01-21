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

//client   
exports.CLIENT_INSERT_QUERY = "INSERT INTO client Set ?";
exports.CLIENT_UPDATE_QUERY = "UPDATE client SET secret = ?, name = ?, web_site = ?, email = ?, enabled = ? " +
                              "WHERE client_id = ? ";
exports.CLIENT_GET_BY_ID_QUERY = "SELECT client_id, secret, name, web_site, email, enabled FROM client WHERE client_id = ?";
exports.CLIENT_DELETE_QUERY = "DELETE FROM client WHERE client_id = ?";
exports.CLIENT_LIST_QUERY = "SELECT client_id, name, web_site, email, enabled FROM client";

//client redirect uri
exports.CLIENT_REDIRECT_URI_INSERT_QUERY = "INSERT INTO client_redirect_uri Set ?";
exports.CLIENT_REDIRECT_URI_DELETE_QUERY = "DELETE FROM client_redirect_uri WHERE id = ?";
exports.CLIENT_REDIRECT_URI_DELETE_ALL_QUERY = "DELETE FROM client_redirect_uri WHERE client_id = ?";
exports.CLIENT_REDIRECT_URI_LIST_QUERY = "SELECT * FROM client_redirect_uri WHERE client_id = ?";
exports.CLIENT_REDIRECT_URI_QUERY = "SELECT * FROM client_redirect_uri WHERE client_id = ? and uri = ? ";


//client allowed URI
exports.CLIENT_ALLOWED_URI_INSERT_QUERY = "INSERT INTO client_allowed_uri Set ?";
exports.CLIENT_ALLOWED_URI_DELETE_QUERY = "DELETE FROM client_allowed_uri WHERE id = ?";
exports.CLIENT_ALLOWED_URI_LIST_QUERY = "SELECT * from client_allowed_uri WHERE client_id = ?";
exports.CLIENT_ALLOWED_URI_QUERY = "SELECT * from client_allowed_uri WHERE client_id = ? and uri = ? ";


//client roles
exports.CLIENT_ROLE_INSERT_QUERY = "INSERT INTO client_role Set ?";
exports.CLIENT_ROLE_DELETE_QUERY = "DELETE FROM client_role WHERE id = ?";
exports.CLIENT_ROLE_LIST_QUERY = "SELECT * FROM client_role WHERE client_id = ?";

//client scope
exports.CLIENT_SCOPE_INSERT_QUERY = "INSERT INTO client_scope Set ?";
exports.CLIENT_SCOPE_DELETE_QUERY = "DELETE FROM client_scope WHERE id = ?";
exports.CLIENT_SCOPE_LIST_QUERY = "SELECT * FROM client_scope WHERE client_id = ?";

//client role uri
exports.CLIENT_ROLE_URI_INSERT_QUERY = "INSERT INTO uri_role Set ?";
exports.CLIENT_ROLE_URI_DELETE_QUERY = "DELETE FROM uri_role WHERE client_role_id = ? and client_allowed_uri_id = ?";
exports.CLIENT_ROLE_URI_LIST_QUERY = "SELECT * FROM uri_role WHERE client_role_id = ?";


//client grant type
exports.CLIENT_GRANT_TYPE_INSERT_QUERY = "INSERT INTO client_grant_type Set ?";
exports.CLIENT_GRANT_TYPE_DELETE_QUERY = "DELETE FROM client_grant_type WHERE id = ?";
exports.CLIENT_GRANT_TYPE_LIST_QUERY = "SELECT * FROM client_grant_type WHERE client_id = ?";


exports.CLIENT_ROLE_URI_JOIN_QUERY = "SELECT cr.id as role_id, cr.role, " +
                                     "cau.id as uri_id, cau.uri, cr.client_id " +
                                     "FROM client_role cr inner join " +
                                     "uri_role ur on cr.id = ur.client_role_id " +
                                     "left join client_allowed_uri cau on cau.id = ur.client_allowed_uri_id " +
                                     "WHERE cr.client_id = ? " +
                                     "order by ur.client_role_id ";
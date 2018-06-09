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

exports.PASSWORD_GRANT_INSERT_QUERY = "INSERT INTO password_grant Set ?";
exports.PASSWORD_GRANT_GET_BY_ID_QUERY = "SELECT id, client_id, user_id, access_token_id " +
                                         "FROM password_grant WHERE client_id = ? and user_id = ?";
exports.PASSWORD_GRANT_DELETE_QUERY = "DELETE FROM password_grant WHERE client_id = ? and user_id = ?";


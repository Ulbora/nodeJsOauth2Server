exports.AUTHORIZATION_CODE_INSERT_QUERY = "INSERT INTO authorization_code Set ?";
exports.AUTHORIZATION_CODE_GET_BY_ID_QUERY = "SELECT authorization_code, client_id, user_id, expires,  access_token_id "+
                                             "FROM authorization_code WHERE client_id = ?";
exports.AUTHORIZATION_CODE_DELETE_QUERY = "DELETE FROM authorization_code WHERE client_id = ?";


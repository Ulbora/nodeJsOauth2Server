exports.REFRESH_TOKEN_INSERT_QUERY = "INSERT INTO refresh_token Set ?";
exports.REFRESH_TOKEN_GET_BY_ID_QUERY = "SELECT id, token FROM refresh_token WHERE id = ?";
exports.REFRESH_TOKEN_DELETE_QUERY = "DELETE FROM refresh_token WHERE id = ?";


exports.ACCESS_TOKEN_INSERT_QUERY = "INSERT INTO access_token Set ?";
exports.ACCESS_TOKEN_GET_BY_ID_QUERY = "SELECT id, token, expires, refresh_token_id FROM access_token WHERE id = ?";
exports.ACCESS_TOKEN_DELETE_QUERY = "DELETE FROM access_token WHERE id = ?";
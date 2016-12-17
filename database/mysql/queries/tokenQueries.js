exports.REFRESH_TOKEN_INSERT_QUERY = "INSERT INTO refresh_token Set ?";
exports.REFRESH_TOKEN_GET_BY_ID_QUERY = "SELECT id, token FROM refresh_token WHERE id = ?";
exports.REFRESH_TOKEN_DELETE_QUERY = "DELETE FROM refresh_token WHERE id = ?";

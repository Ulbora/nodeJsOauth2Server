//client   
exports.CLIENT_INSERT_QUERY = "INSERT INTO client Set ?";
exports.CLIENT_UPDATE_QUERY = "UPDATE client SET secret = ?, redirect_uri = ?, name = ?, web_site = ?, email = ?, enabled = ? " +
                              "WHERE client_id = ? ";
exports.CLIENT_GET_BY_ID_QUERY = "SELECT client_id, redirect_uri, name, web_site, email, enabled FROM client WHERE client_id = ?";
exports.CLIENT_DELETE_QUERY = "DELETE FROM client WHERE client_id = ?";
exports.CLIENT_LIST_QUERY = "SELECT client_id, redirect_uri, name, web_site, email, enabled FROM client";


//client allowed URI
exports.CLIENT_ALLOWED_URI_INSERT_QUERY = "INSERT INTO client_allowed_uri Set ?";
exports.CLIENT_ALLOWED_URI_DELETE_QUERY = "DELETE FROM client_allowed_uri WHERE id = ?";
//exports.CLIENT_ALLOWED_URI_LIST_QUERY = "SELECT * from client_allowed_uri";


//client roles
exports.CLIENT_ROLE_INSERT_QUERY = "INSERT INTO client_role Set ?";
exports.CLIENT_ROLE_DELETE_QUERY = "DELETE FROM client_role WHERE id = ?";
//exports.CLIENT_ROLE_LIST_QUERY = "SELECT * FROM client_role";

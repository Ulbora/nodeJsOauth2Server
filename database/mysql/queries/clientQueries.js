exports.CLIENT_INSERT_QUERY = "INSERT INTO client Set ?";
exports.CLIENT_UPDATE_QUERY = "UPDATE client SET secret = ?, redirect_uri = ?, name = ?, web_site = ?, email = ?, enabled = ? " +
                              "WHERE client_id = ? ";



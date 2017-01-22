exports.login = function(req, res){
    var loggedIn = (req.session.loggedIn);
        var u = "";
        var p = "";
        if (req.cookies.rememberme) {
            u = req.cookies.username;
            p = req.cookies.password;
        }
        res.render("login", {username: u, password: p, loginFailed: false, loggedIn: loggedIn});
};


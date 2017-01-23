var loginController = require("../webControllers/loginController");
exports.init = function (app) {
    app.get('/', function (req, res) {
        var sess = req.session;
        console.log("session: " + sess);
        req.session.user = "ken";
        console.log(req.session.user);
        var n = req.session.user;
        res.render('index', {n});
    });
    app.get('/login', function (req, res) {
        loginController.login(req, res);
    });
};
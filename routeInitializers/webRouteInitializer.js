var loginController = require("../webControllers/loginController")
exports.init = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/login', function (req, res) {
        loginController.login(req, res);
    });
};
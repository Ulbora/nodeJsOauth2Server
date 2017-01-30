var loginController = require("../webControllers/loginController");
var authorizeController = require("../webControllers/authorizeController");
exports.init = function (app, db) {
    authorizeController.init(db);
    app.get('/', function (req, res) {
        var sess = req.session;
        console.log("session: " + sess);
        req.session.user = "ken";
        console.log(req.session.user);
        var n = req.session.user;
        var title = "Ulbora Labs index";
        var params = {
            n: n,
            title: title
        };
        res.render('index', params);
    });
    app.get('/login', function (req, res) {
        loginController.login(req, res);
    });
    app.post('/login', function (req, res) {
        loginController.loginUser(req, res);
    });
    app.get('/oauth/authorize', function (req, res) {
        authorizeController.authorize(req, res);
    });
    
    app.get('/authorizeApp', function (req, res) {
        authorizeController.authorizeApp(req, res);
    });
    app.get('/applicationAuthorize', function (req, res) {
        authorizeController.applicationAuthorization(req, res);
    });
    
    app.get('/oauthError', function (req, res) {
        authorizeController.oauthError(req, res);
    });
};
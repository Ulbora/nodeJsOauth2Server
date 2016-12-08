var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var conf = require('./configuration');
var cors = require('./cors/cors');
//var restServiceInitializer = require('./initializers/restInitializer');
//var db = require("./db/db");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//restServiceInitializer.initialize(app);
//db.initializeMongoDb();

if (conf.CORS_ENABLED) {
    app.use(cors.CORS);
}

app.listen(process.env.PORT || conf.PORT);

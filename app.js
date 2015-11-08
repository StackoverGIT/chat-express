var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require("./libs/log")(module);
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var favicon = require("serve-favicon");
var serveStatic = require('serve-static');
var morganLogger = require('morgan');
var router = express.Router();
var HttpError = require("./error").HttpError;
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var app = express();
var mongoose = require("libs/mongoose");
var errorHandler = require("errorhandler");

app.set('port', config.get('port'));


app.set('views', __dirname + '/templates');
app.engine('ejs', require("ejs-locals")); // layout partions block
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/img/favicon.ico'));

if (app.get("env") == "development") {
    app.use(morganLogger('dev'));
} else {
    app.use(morganLogger('combined'));
}

app.use(bodyParser.urlencoded({
    extended: true
})); // req.body

app.use(cookieParser('your secret here')); // req.cookies
app.use(session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    saveUninitialized: true,
    resave: true
}));

//app.use(function(req, res, next) {
//    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//    res.end("Visits: " + req.session.numberOfVisits)
//});

app.use(require('middleware/sendHttpError'));
require("./routes")(app);

app.use(serveStatic(path.join(__dirname, 'public')));



app.use(function(err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }
    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

/**
 * Created by thanhnv on 2/18/15.
 */

'use strict';

/**
 * Module dependencies.
 */
let fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    passport = require('passport'),
    config = require('./config'),
    redis = require("redis").createClient(),
    RedisStore = require('connect-redis')(session),
    nunjucks = require('nunjucks'),
    _ = require('lodash'),
    //serveStatic = require('serve-static'),
    path = require('path');

module.exports = function () {
    // Initialize express app
    let app = express();

    // Setting the app router and static folder
    /*let setStaticResourceFolder = function (req, res, next) {
     //console.log(process.cwd());
     let myRegex = /^(\/admin\/?)/g;
     let match = myRegex.exec(req.url);
     if (match) {
     let serve = serveStatic(__base + 'app/backend/views_layout');
     }
     else {
     next();
     }
     serve(req, res, next);
     };*/

    redis.get(config.key, function (err, result) {
        if (result != null) {
            let tmp = JSON.parse(result);
            _.assign(config, tmp);
        }
        else {
            redis.set(config.key, JSON.stringify(config), redis.print);
        }
        app.locals.title = config.app.title;
        app.locals.description = config.app.description;
        app.locals.keywords = config.app.keywords;
        app.locals.facebookAppId = config.facebook.clientID;
    });
    // Should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
    app.use(express.static(path.resolve('./public')));
    // Showing stack errors
    app.set('showStackError', true);

    // Set swig as the template engine
    //app.engine('html', nunjucks);
    /*let e = nunjucks.configure(__base + 'app/themes', {
        autoescape: true,
        express: app
    });
    //Initials custom filter
    __.getAllCustomFilter(e);*/

    // Set views path and view engine
    app.set('view engine', 'html');
    //app.set('views', ['./app/themes', './app/widgets']);

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        //app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    // Express redis session storage
    let secret = "hjjhdsu465aklsdjfhasdasdf342ehsf09kljlasdf";
    app.use(session({
        store: new RedisStore({host: config.redis.host, port: config.redis.port, client: redis}),
        secret: secret,
        resave: false,
        saveUninitialized: true
    }));
    app.use(function (req, res, next) {
        if (!req.session) {
            return next(new Error('Session destroy')); // handle error
        }
        next(); // otherwise continue
    });
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //flash messages
    app.use(require(__base + 'app/middleware/flash-plugin.js'));

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');


    //app.use(setStaticResourceFolder);
    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        res.locals.route = req.url;
        if (req.user) {
            res.locals.__user = req.user;
        }
        next();
    });

    //app.use(require('../app/middleware/theme-plugin.js'));

    // Globbing admin module files
    redis.get('all_modules', function (err, results) {
        if (results != null) {
            global.__modules = JSON.parse(results);
        }
        else {
            config.getGlobbedFiles('./app/backend/modules/*/module.js').forEach(function (routePath) {
                console.log(path.resolve(routePath));
                require(path.resolve(routePath))(__modules);
            });
            redis.set('all_modules', JSON.stringify(__modules), redis.print);
        }
    });

    //module manager backend
    require(__base + 'app/backend/core_route')(app);
    //app.use('/admin/*', require('../app/middleware/modules-plugin.js'));
    // Globbing routing admin files
    config.getGlobbedFiles('./app/backend/modules/*/route.js').forEach(function (routePath) {
        app.use('/' + config.admin_prefix, require(path.resolve(routePath)));
    });

    // Globbing routing admin files
    config.getGlobbedFiles('./app/frontend/modules/*/settings/*.js').forEach(function (routePath) {
        __setting_menu_module.push(require(path.resolve(routePath))(app, config));
    });

    //module manager frontend
    app.use('/*', require('../app/middleware/modules-f-plugin.js'));

    // Globbing frontend module files
    config.getGlobbedFiles('./app/frontend/modules/*/module.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(__f_modules);
    });

    // Globbing routing files
    require(__base + 'app/frontend/modules/routes')(app);
    // Globbing menu files
    config.getGlobbedFiles('./app/menus/*/*.js').forEach(function (routePath) {
        console.log(routePath);
        require(path.resolve(routePath))(__menus);
    });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        let env = __.createNewEnv([__base + 'app/frontend/themes', __base + 'app/frontend/themes/' + config.themes]);
        env.render('404.html', res.locals, function (err, re) {
            res.send(re);
        });

    });

    if (process.env.NODE_ENV === 'secure') {
        // Log SSL usage
        console.log('Securely using https protocol');

        // Load SSL key and certificate
        let privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        let certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

        // Create HTTPS Server
        let httpsServer = https.createServer({
            key: privateKey,
            cert: certificate
        }, app);

        // Return HTTPS server instance
        return httpsServer;
    }

    // Return Express server instance
    return app;
};

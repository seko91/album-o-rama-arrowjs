'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
global.__base = __dirname + '/';
global.__ = require('./libs/global_function');
global.__modules = require('./libs/modules_backend_manager.js')();
global.__f_modules = require('./libs/modules_frontend_manager.js')();
global.__menus = require('./app/menus/menus_manager')();
global.__widgets = require('./app/widgets/widgets_manager')();
global.__models = require('./libs/models_manager');
global.__acl = require('./libs/acl');
global.__messages = [];
global.__current_theme = {};
global.__pluginManager = require('./libs/plugins_manager');
global.BaseModuleBackend = require('./app/backend/base_module');
global.BaseModuleFrontend = require('./app/frontend/base_module');
__pluginManager.loadAllPlugin();

// Init SEO
redis.get('seo_enable', function (err, result) {
    if(result != null) {
        global.__seo_enable = result;
    }
    else
    {
        redis.set('seo_enable', true, function(err, res) {
            if (err) {
                console.log("Init app Redis reply error: " + err);
            } else {
                console.log("Init app Redis reply: " + res);
            }
        });
        global.__seo_enable = true;
    }
});

// Init the express application
var app = require('./config/app')();

// Bootstrap passport config
require('./config/passport')();

var server = app.listen(config.port);
global.__socketManager = require('./libs/socket_manager')(server);
// Start the app by listening on <port>

// Expose app
module.exports = app;

// Logging initialization
console.log('Application started on port ' + config.port);
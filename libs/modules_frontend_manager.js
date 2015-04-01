'use strict'
/**
 * Created by thanhnv on 2/23/15.
 */
let config = require('../config/config');
let redis = require('redis').createClient();
let path = require('path');
let modules = {};
module.exports = function () {
    return modules;
};
module.exports.loadAllModules = function () {

    // Globbing admin module files
    let module_tmp = {};
    config.getGlobbedFiles(__base + 'app/frontend/*/module.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(module_tmp);
    });
    //add new module
    for (let i in module_tmp) {
        if (__f_modules[i] == undefined) {
            __f_modules[i] = module_tmp[i];
        }
        else {
            __f_modules[i] = _.assign(__f_modules[i], module_tmp[i]);
        }

    }
    //remove module
    for (let i in __f_modules) {
        if (module_tmp[i] == undefined) {
            delete __f_modules[i];
        }
    }
    redis.set('all_fmodules', JSON.stringify(__f_modules), redis.print);
}


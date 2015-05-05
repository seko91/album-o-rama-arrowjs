/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

let util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash'),
    promise = require('bluebird'),
    sequelize = require('sequelize');

function IndexModule() {
    BaseModuleFrontend.call(this);
    this.path = "/about";
}
let _module = new IndexModule();
_module.index = function (req, res) {
    //_module.render(req, res, 'index', {});
    res.send('Hello World');
};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

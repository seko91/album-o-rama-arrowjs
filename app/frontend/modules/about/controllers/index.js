/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

var util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash'),
    promise = require('bluebird'),
    sequelize = require('sequelize');

function IndexModule() {
    BaseModuleFrontend.call(this);
    this.path = "/about";
}
var _module = new IndexModule();
_module.index = function (req, res) {
    res.setHeader('Cache-Control', 'public, max-age=31557600');
    _module.render(req, res, 'index', {});
};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

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
    this.path = "/index";
}
var _module = new IndexModule();
_module.index = function (req, res) {
    var index_view = 'index';
    promise.all([
        __models.albums.findAll({
            order: [
                [sequelize.fn('RANDOM')]
            ],
            limit: 30
        }),
        __models.tags.findAll({
            order: [
                [sequelize.fn('RANDOM')]
            ],
            limit: 8
        })
    ]).then(function(results){
        _module.render(req, res, index_view, {
            albums: results[0],
            tags: results[1]
        });
    });

};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

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
    this.path = "/search";
}
var _module = new IndexModule();
_module.index = function (req, res) {
    var index_view = 'index';
    var key = req.query.s || '';
    key = '%' + key.replace(/\s+/g, '%') + '%';
    __models.artists.findAll({
        where: 'LOWER(name) like \'' +key + '\'',
        include: [
            {
                model: __models.artists_photos,
                attributes: ['url'],
                where: {
                    type: 'large'
                }
            }
        ],
        order: 'listeners DESC',
        limit: 30
    }).then(function(ar){
        _module.render(req, res, index_view, {
            artists: ar
        });
    });
};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

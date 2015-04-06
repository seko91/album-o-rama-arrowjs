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
    this.path = "/album";
}
var _module = new IndexModule();
_module.albumById = function (req, res) {
    var index_view = 'index';
    var id = req.params.id;
    promise.all([
        __models.albums_photos.find({
            where: {
                albums_id: id,
                type: 'extralarge'
            }
        }),
        __models.albums.find({
            where: {
                id: id
            },
            include: [
                {
                    model: __models.artists
                }
            ]
        }),
        __models.albums_tracks.findAll({
            where: {
                albums_id: id
            }
        }),
        __models.albums_tags.findAll({
            where: {
                albums_id: id
            },
            include: [
                {
                    model: __models.tags
                }
            ]
        })
    ]).then(function(results){
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        _module.render(req, res, index_view, {
            photo: results[0],
            album: results[1],
            tracks: results[2],
            tags: results[3]
        });
    });

};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

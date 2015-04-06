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
    this.path = "/artist";
}
var _module = new IndexModule();
_module.index = function (req, res) {
    var index_view = 'index';
    var id = req.params.id;
    promise.all([
        //artists
        __models.artists.find({
            where: {
                id: id
            },
            include: [
                {
                    model: __models.artists_photos,
                    attributes: ['url'],
                    where: {
                        type: 'extralarge'
                    }
                }
            ]
        }),
        //related tags
        __models.artists_tags.findAll({
            where: {
                artists_id: id
            },
            include: [
                {
                    model: __models.tags
                }
            ],
            limit: 10
        }),
        // top albums
        __models.albums.findAll({
            where: {
                artists_id: id,
                playcount: {
                    $gt: 25000
                }
            },
            include: [
                {
                    model: __models.albums_photos,
                    where: {
                        type: 'large'
                    },
                    attributes: ['url']
                }
            ],
            order: 'playcount DESC',
            limit: 18
        }),
        //similar artists
        __models.sequelize.query(
            'SELECT ' +
            'ar.id, ' +
            'ar.name, ' +
            'ar.uri, ' +
            'ap.url ' +
            'FROM artists_similar ars, ' +
            'artists ar, ' +
            'artists_photos ap ' +
            'WHERE ' +
            'ars.similar_artist_id = ar.id AND ' +
            'ars.similar_artist_id = ap.artists_id AND ' +
            'ap.type = \'large\' AND ' +
            'ars.artists_id = ' + id +
            ' ORDER BY ar.listeners DESC ' +
            'LIMIT 10',
            { type: sequelize.QueryTypes.SELECT }
        )
    ]).then(function(data){
        //console.log(data[0], '---@@@@@---');
        //console.log(data[1], '---@@@@@---');
        //console.log(data[2], '---@@@@@---');
        //console.log(data[3], '---@@@@@---');
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        _module.render(req, res, index_view, {
            artistInfo: data[0],
            tags:data[1],
            albums: data[2],
            similars: data[3]
        });
    });

};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

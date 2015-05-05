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
    this.path = "/charts";
}
let _module = new IndexModule();
_module.index = function (req, res) {
    let index_view = 'index';
    let tagGenres = [
        'pop', 'rock', 'rap',
        'rnb', 'electronic', 'alternative',
        'folk', 'country', 'hip-hop',
        'dance', 'chillout', 'trip-hop',
        'metal', 'ambient', 'soul',
        'jazz', 'latin', 'punk'
    ];
    let charts = [];

    tagGenres.forEach(function (tag) {
        charts.push(
            __models.sequelize.query(
                'SELECT albums.id, albums.name, artists.uri, artists.id as artist_id, artists.name as artist, albums_photos.url \
                FROM albums, artists, albums_tags, albums_photos, tags \
                WHERE \
                albums.id = albums_tags.albums_id AND \
                albums.artists_id = artists.id AND \
                albums_photos.albums_id = albums.id AND \
                tags.id = albums_tags.tags_id AND \
                tags.name = \'' + tag + '\' AND \
                albums_photos.type = \'small\' \
                ORDER BY albums.playcount DESC \
                LIMIT 10', {type: sequelize.QueryTypes.SELECT}
            )
        );
    });

    promise.all(charts).then(function (results) {
        _module.render(req, res, index_view, {
            charts: results,
            genres: tagGenres
        });
    });
};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;

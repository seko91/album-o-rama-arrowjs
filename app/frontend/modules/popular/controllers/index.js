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

function PopularModule() {
    BaseModuleFrontend.call(this);
    this.path = "/popular";
}
let _module = new PopularModule();
_module.index = function (req, res) {
    let index_view = 'index';
    promise.all([
        __models.sequelize.query(
            'SELECT al.id, al.name, ar.uri, ar.id as artist_id, ar.uri as artist_uri, ar.name as artist, ap.url ' +
            'FROM albums al, albums_photos ap, artists ar ' +
            'WHERE al.artists_id = ar.id AND ap.albums_id = al.id AND ' +
            'ap.type = \'large\' ' +
            'ORDER BY al.playcount DESC ' +
            'LIMIT 30',
            { type: sequelize.QueryTypes.SELECT }
        ),
        __models.sequelize.query(
            'SELECT t.name, COUNT(*) FROM tags t JOIN albums_tags at ON t.id = at.tags_id ' +
            'GROUP BY 1 HAVING COUNT(*) > 50 LIMIT 14',
            { type: sequelize.QueryTypes.SELECT }
        )
    ]).then(function(results){
        _module.render(req, res, index_view, {
            albums: results[0],
            tags: results[1]
        });
    });

};
util.inherits(PopularModule, BaseModuleFrontend);
module.exports = _module;

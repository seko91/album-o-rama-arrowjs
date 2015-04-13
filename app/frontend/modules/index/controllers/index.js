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
    this.path = "/index";
}
let _module = new IndexModule();
_module.index = function (req, res) {
    let index_view = 'index';
    promise.all([
        __models.albums_photos.findAll({
            where: {
                type: 'large'
            },
            order: [
                [sequelize.fn('RANDOM')]
            ],
            limit: 30,
            include: [
                {
                    model: __models.albums,
                    include: [
                        {
                            model: __models.artists
                        }
                    ]
                }
            ]
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

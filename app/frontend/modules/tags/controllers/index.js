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
    promise = require('bluebird');

function TagModule() {
    BaseModuleFrontend.call(this);
    this.path = "/tag";
}
var _module = new TagModule();
_module.index = function (req, res) {
    var index_view = 'index';
    var page = req.params.page || 1;
    var name = req.params.name;
    __models.tags.find({
        where: {
            name: name
        }
    }).then(function(tag) {
        return __models.albums_tags.findAndCountAll({
            where: {
                tags_id: tag.id
            },
            include: [
                {
                    model: __models.albums,
                    include: [
                        {
                            model: __models.artists
                        },
                        {
                            model: __models.albums_photos,
                            where: {
                                type: 'large'
                            }
                        }
                    ]
                }
            ],
            limit: 30,
            offset: (page - 1) * 30
        },
            { raw: true })
    }).then(function(results){
        var totalPage = Math.ceil(results.count / 30);
        var prev = (page > 1) ? page - 1 : null,
            next = (page + 1 <= totalPage) ? page +  1 : null;

        _module.render(req, res, index_view, {
            tagName: name,
            results: results.rows,
            prev: prev,
            next: next
        });
    }).catch(function(err) {
        _module.render(req, res, index_view, {
            tagName: null,
            results: null,
            prev: null,
            next: null
        });
    });

};
util.inherits(TagModule, BaseModuleFrontend);
module.exports = _module;

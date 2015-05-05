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
    promise = require('bluebird');

function TagModule() {
    BaseModuleFrontend.call(this);
    this.path = "/tag";
}
let _module = new TagModule();
_module.index = function (req, res) {
    let index_view = 'index';
    let page = req.params.page || 1;
    let name = req.params.name;
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
        })
    }).then(function(results){
        let totalPage = Math.ceil(results.count / 30);
        let prev = (page > 1) ? (page - 1) : 0,
            next = ((page + 1) <= totalPage) ? (page +  1) : 0;

        _module.render(req, res, index_view, {
            tagName: name,
            results: results.rows,
            prev: prev,
            next: next
        });
    });

};
util.inherits(TagModule, BaseModuleFrontend);
module.exports = _module;

"use strict"
var BaseWidget = require('../base_widget'),
    util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird');




function PostsTopView() {
    let _base_config = {
        alias: "arr_posts_top_view",
        name: "Posts Top View",
        description: "Display posts top view",
        author: "ZaiChi",
        version: "0.1.0",
        options: {
            id: '',
            title: '',
            number_to_show: '',
            display_date: '',
            display_index: ''
        }
    };
    PostsTopView.super_.call(this);
    _.assign(this, _base_config);
    this.files = BaseWidget.prototype.getAllLayouts.call(this, _base_config.alias);
}

util.inherits(PostsTopView, BaseWidget);

PostsTopView.prototype.render = function (widget) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        __models.posts.findAll({
            where : "type = 'post'",
            include: [ __models.user],
            order: "hit DESC",
            limit: parseInt(widget.data.number_to_show)
        }).then(function (posts) {
            resolve(BaseWidget.prototype.render.call(_this, widget, {items: posts}));
        });
    });
};

module.exports = PostsTopView;
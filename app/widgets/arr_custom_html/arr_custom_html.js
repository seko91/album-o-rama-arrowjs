'use strict'
/**
 * Created by thanhnv on 2/17/15.
 */

var BaseWidget = require('../base_widget'),
    util = require('util'),
    _ = require('lodash');

function CustomHtml() {
    let _base_config = {
        alias: "arr_custom_html",
        name: "Custom HTML",
        description: "Create block HTML to view",
        author: "Nguyen Van Thanh",
        version: "0.1.0",
        options: {
            id: '',
            title: '',
            content: ''
        }
    };
    CustomHtml.super_.call(this);
    _.assign(this, _base_config);
    this.files = BaseWidget.prototype.getAllLayouts.call(this, _base_config.alias);
}
util.inherits(CustomHtml, BaseWidget);

module.exports = CustomHtml;

'use strict'
/**
 * Created by thanhnv on 3/9/15.
 */
var Promise = require('bluebird'),
    fs = require('fs'),
    _ = require('lodash'),
    config = require(__base + 'config/config');

var _base_config = {
    alias: "Base",
    name: "Base",
    description: "Base",
    author: "Nguyen Van Thanh",
    version: "0.1.0",
    options: {
        id: '',
        cls: '',
        title: '',
        file: ''
    }
};

var env = __.createNewEnv();

function BaseWidget() {
    _.assign(this, _base_config);
    this.env = env;
}

BaseWidget.prototype.getAllLayouts = function (alias) {
    let files = [];
    config.getGlobbedFiles(__base + "app/frontend/themes/" + config.themes + '/_widgets/' + alias + '/*.html').forEach(function (path) {
        let s = path.split('/');
        files.push(s[s.length - 1]);
    });
    if (files.length == 0) {
        config.getGlobbedFiles(__base + "app/frontend/themes/default/_widgets/" + alias + "/*.html").forEach(function (path) {
            let s = path.split('/');
            files.push(s[s.length - 1]);
        });
    }
    return files;
};

BaseWidget.prototype.save = function (data) {
    return new Promise(function (done, reject) {
        let json_data = _.clone(data);
        delete json_data.sidebar;
        delete json_data.id;
        json_data = JSON.stringify(json_data);
        if (data.id != '') {
            __models.widgets.find(data.id).then(function (widget) {
                widget.updateAttributes({
                    sidebar: data.sidebar,
                    data: json_data
                }).then(function (widget) {
                    done(widget.id);
                });
            });
        } else {
            __models.widgets.create({
                id: new Date().getTime(),
                widget_type: data.widget,
                sidebar: data.sidebar,
                data: json_data,
                ordering: data.ordering
            }).then(function (widget) {
                done(widget.id);
            });
        }

    });
};

BaseWidget.prototype.render_setting = function (widget_type, widget) {
    let _this = this;
    return new Promise(function (done, reject) {
        env.render(widget_type + '/setting.html', {widget: widget, widget_type: widget_type, files: _this.files},
            function (err, re) {
                done(re);
            }).catch(function (err) {
                reject(err);
            });
    });
};

BaseWidget.prototype.render = function (widget, data) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let renderWidget = Promise.promisify(env.render, env);
        let widgetFile = widget.widget_type + '/' + widget.data.file;
        let widgetFilePath = __base + 'app/frontend/themes/' + config.themes + '/_widgets/' + widgetFile;

        if (!fs.existsSync(widgetFilePath)) {
            widgetFilePath = 'default/_widgets/' + widgetFile;
        }
        else {
            widgetFilePath = config.themes + '/_widgets/' + widgetFile;
        }
        if (widgetFilePath.indexOf('.html') == -1) {
            widgetFilePath += '.html';
        }
        let context = _.assign({widget: widget}, data);
        resolve(renderWidget(widgetFilePath, context).catch(function (err) {
            return "<p>" + err.cause;
        }));
    });
};

module.exports = BaseWidget;

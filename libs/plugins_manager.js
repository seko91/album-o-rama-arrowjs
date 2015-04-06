'use strict'
/**
 * Created by thanhnv on 3/13/15.
 */
var config = require(__base + 'config/config'),
    _ = require('lodash'),
    redis = require('redis').createClient(),
    Promise = require('bluebird');
function PluginManager() {
    let self = this;
    self.redis_key = 'all_plugins';
    self.plugins = [];
    self.loadAllPlugin = function () {
        redis.get(self.redis_key, function (err, results) {
            if (results != null) {
                let arr_data = JSON.parse(results);
                let index = 0;
                config.getGlobbedFiles(__base + 'app/plugins/*/*.js').forEach(function (filePath) {
                    let plugin = require(filePath);
                    _.assign(plugin, arr_data[index++]);
                    self.plugins.push(plugin);
                });
            }
            else {
                config.getGlobbedFiles(__base + 'app/plugins/*/*.js').forEach(function (filePath) {
                    let plugin = require(filePath);
                    self.plugins.push(plugin);
                });
                redis.set(self.redis_key, JSON.stringify(self.plugins), redis.print);
            }
        });

    };
    self.reloadAllPlugin = function () {
        config.getGlobbedFiles(__base + 'app/plugins/*/*.js').forEach(function (filePath) {
            self.plugins.push(require(filePath));
        });
    };
    self.getPlugin = function (alias) {
        for (let i in self.plugins) {
            if (self.plugins[i].alias == alias) {
                return self.plugins[i];

            }
        }
    };

}

module.exports = new PluginManager();

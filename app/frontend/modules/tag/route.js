/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    let tag = require('./controllers/index');
    app.route('/tag/:name').get(tag.index);
    app.route('/tag/:name/:page').get(tag.index);
};
/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var about = require('./controllers/index');
    app.route('/about').get(about.index);

};
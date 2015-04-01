/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var pop = require('./controllers/index');
    app.route('/popular').get(pop.index);
};
/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    let artist = require('./controllers/index');
    app.route('/artist/:id/:name').get(artist.index);

};
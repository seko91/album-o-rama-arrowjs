/**
 * Created by thanhnv on 4/1/15.
 */
"use strict"
module.exports = function (app) {
    require('./core/route')(app);
    require('./index/route')(app);
    require('./blog/route')(app);
    require('./todos/route')(app);
    require('./about/route')(app);
    require('./album/route')(app);
    require('./artist/route')(app);
    require('./charts/route')(app);
    require('./popular/route')(app);
    require('./search/route')(app);
    require('./tag/route')(app);
};

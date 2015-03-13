/**
 * Created by thanhnv on 3/13/15.
 */
var Promise = require('bluebird'),
    _ = require('lodash');
var _base_config = {
    alias: 'comment-post',
    name: 'Comment to Post',
    author: 'Jack',
    version: '0.1.0',
    description: 'Add comment in a Post',
    active: true,
    options: {}
};
function CommentPostPlugin() {
    _.assign(this, _base_config);
    this.before_close_head_tag = function (data) {
        return new Promise(function (done, reject) {
            console.log(data);
            done('Comment post plugins');
        });
    }
}
module.exports = new CommentPostPlugin();

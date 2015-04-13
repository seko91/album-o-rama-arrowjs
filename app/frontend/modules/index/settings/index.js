'use strict'

module.exports = function (app, config) {
    let alias = 'index';

    app.route('/_menus/' + alias + '/page/:page').get(function (req, res) {
        if (req.isAuthenticated()) {
            // Send json response
            res.jsonp({
                totalRows: 1,
                totalPage: 1,
                items: [
                    {
                        'title': 'Home',
                        'link': '/'
                    },
                    {
                        'title': 'Popular',
                        'link': '/popular'
                    },
                    {
                        'title': 'Charts',
                        'link': '/charts'
                    },
                    {
                        'title': 'About',
                        'link': '/about'
                    }
                ],
                title_column: 'title',
                link_template: '{link}'
            });
        }
        else {
            res.send("Not Authenticated");
        }
    });

    return {
        title: 'Static pages',
        alias: alias,
        search: false
    };
};

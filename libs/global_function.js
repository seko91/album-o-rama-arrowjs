'use strict'
/**
 * Created by thanhnv on 2/26/15.
 */
let config = require(__base + 'config/config');

exports.create_breadcrumb = function (root) {
    let arr = root.slice(0);
    for (let i = 1; i < arguments.length; i++) {
        if (arguments[i] != undefined)
            arr.push(arguments[i]);
    }
    return arr;
};
exports.active_menu = function (value, string_to_compare, cls, index) {
    let arr = value.split('/');
    let st = "active";
    if (cls) {
        st = cls;
    }
    if (~string_to_compare.indexOf('/')) {
        string_to_compare = string_to_compare.split('/')[index];
    }
    if (index) {
        return arr[index] === string_to_compare ? st : "";
    }
    return arr[2] == string_to_compare ? st : "";
};

exports.sortMenus = function (menus) {
    let sortable = [];
    for (let m in menus) {
        //console.log(menus[m].sort);
        sortable.push({menu: m, sort: menus[m].sort})
    }
    sortable.sort(function (a, b) {
        if (a.sort < b.sort)
            return -1;
        if (a.sort > b.sort)
            return 1;
        return 0;
    });
    return sortable;
};
exports.getWidget = function (alias) {
    for (let i in __widgets) {
        if (__widgets[i].alias == alias) {
            return __widgets[i];
        }
    }
};
exports.createNewEnv = function (views) {
    let nunjucks = require('nunjucks');
    let env;
    if (views) {
        env = new nunjucks.Environment(new nunjucks.FileSystemLoader(views));
    }
    else {
        env = new nunjucks.Environment(new nunjucks.FileSystemLoader([__base + 'app/widgets', __base + 'app/frontend/themes']));
    }
    env = __.getAllCustomFilter(env);
    env = __.getAllGlobalVariable(env);
    return env;
};
exports.getAllCustomFilter = function (env) {
    config.getGlobbedFiles(__base + 'custom_filters/*.js').forEach(function (routePath) {
        require(routePath)(env);
    });
    return env;
};
exports.getAllGlobalVariable = function (env) {
    env.addGlobal('create_link', function (module_name, link) {
        return module_name + '/' + link;
    });
    return env;
};


exports.parseCondition = function (column_name, value, col) {
    column_name = (col.filter.model ? (col.filter.model + '.') : '') + column_name;
    column_name = column_name.replace(/(.*)\.(.*)/, '"$1"."$2"');
    if (col.filter.data_type == 'string') {
        return column_name + ' ilike ?';
    }
    else if (col.filter.data_type == 'datetime') {
        return column_name + " between ?::timestamp and ?::timestamp";
    }
    else {
        if (~value.indexOf('><') || col.filter.type == 'datetime') {
            return column_name + " between ? and ?";
        }
        else if (~value.indexOf('<>')) {
            return column_name + " not between ? and ?";
        }
        else if (~value.indexOf('>=')) {
            return column_name + " >= ?";
        }
        else if (~value.indexOf('<=')) {
            return column_name + " <= ?";
        }
        else if (~value.indexOf('<')) {
            return column_name + " < ?";
        }
        else if (~value.indexOf('>')) {
            return column_name + " > ?";
        }
        else if (~value.indexOf(';')) {
            return column_name + " in (?)";
        }
        else {
            return column_name + " = ?";
        }
    }

};
exports.parseValue = function (value, col) {
    console.log(value);
    if (col.filter.type == 'datetime') {
        return value.split(/\s+-\s+/);
    }
    else if (col.filter.data_type == 'string') {
        value = "%" + value + "%";
    }
    //value = value.replace(/[^a-zA-Z0-9\%\?\-\/]/g, "");
    if (~value.indexOf('><')) {
        return value.split('><');
    }
    else if (~value.indexOf('<>')) {
        return value.split('<>');
    }
    else {
        return value.replace(/[^a-zA-Z0-9\%\?\-\/\.]/g, "");
    }

};
exports.createFilter = function (req, res, route, reset_link, current_column, order, columns, customCondition) {
    //Add button Search
    if (route != '') {
        res.locals.searchButton = __acl.customButton(route);
        res.locals.resetFilterButton = __acl.customButton(reset_link);
    }
    let conditions = [];
    let values = [];
    values.push('command');
    let getColumn = function (name) {
        for (let i in columns) {
            if (columns[i].column == name) {
                return columns[i];
            }
        }
        return {filter: {}};
    };
    for (let i in req.query) {
        if (req.query[i] != '') {
            let col = getColumn(i);
            if (!col) continue;
            if (col.query) {
                conditions.push(col.query);
            }
            else {
                conditions.push(__.parseCondition(i, req.query[i], col));
            }

            let value = __.parseValue(req.query[i], col);
            console.log(value);
            if (Array.isArray(value)) {
                for (let y in value) {
                    values.push(value[y].trim());
                }

            }
            else {
                values.push(value);
            }

        }
    }
    let tmp = conditions.length > 0 ? "(" + conditions.join(" AND ") + ")" : " 1=1 ";
    let stCondition = tmp + (customCondition ? customCondition : '');
    values[0] = stCondition;
    res.locals.table_columns = columns;
    res.locals.currentColumn = current_column;
    res.locals.currentOrder = order;
    res.locals.filters = req.query;
    return {values: values};
}


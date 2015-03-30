module.exports = function (sequelize, DataTypes) {
    var Tags = sequelize.define("tags", {
        name: DataTypes.STRING(64)
    }, {
        tableName: 'tags',
        createdAt: false,
        updatedAt: false
    });
    return Tags;
};
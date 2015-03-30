module.exports = function (sequelize, DataTypes) {
    var AlbumTag = sequelize.define("albums_tags", {
        albums_id: DataTypes.INTEGER,
        tags_id: DataTypes.INTEGER
    }, {
        tableName: 'albums_tags',
        createdAt: false,
        updatedAt: false
    });
    return AlbumTag;
};
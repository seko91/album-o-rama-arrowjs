module.exports = function (sequelize, DataTypes) {
    var AlbumTag = sequelize.define("albums_tags", {
        albums_id: DataTypes.INTEGER,
        tags_id: DataTypes.INTEGER
    }, {
        tableName: 'albums_tags',
        createdAt: false,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                AlbumTag.belongsTo(models.tags, {foreignKey : 'tags_id'});
                AlbumTag.belongsTo(models.albums, {foreignKey : 'albums_id'});
            }
        }
    });
    return AlbumTag;
};
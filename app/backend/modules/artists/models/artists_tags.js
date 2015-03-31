module.exports = function (sequelize, DataTypes) {
    var ArtistTag = sequelize.define("artists_tags", {
        artists_id: DataTypes.INTEGER,
        tags_id: DataTypes.INTEGER
    }, {
        tableName: 'artists_tags',
        createdAt: false,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                ArtistTag.belongsTo(models.tags, {foreignKey : 'tags_id'});
                ArtistTag.belongsTo(models.albums, {foreignKey : 'artists_id'});
            }
        }
    });
    return ArtistTag;
};
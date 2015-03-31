module.exports = function (sequelize, DataTypes) {
    var ArtistsPhoto = sequelize.define("artists_photos", {
        artists_id: DataTypes.INTEGER,
        type: DataTypes.STRING(32),
        url: DataTypes.STRING(120)
    }, {
        tableName: 'artists_photos',
        createdAt: false,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                ArtistsPhoto.belongsTo(models.albums, {foreignKey : 'artists_id'});
            }
        }
    });
    return ArtistsPhoto;
};
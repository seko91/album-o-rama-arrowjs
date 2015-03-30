module.exports = function (sequelize, DataTypes) {
    var AlbumPhoto = sequelize.define("albums_photos", {
        albums_id: DataTypes.INTEGER,
        type: DataTypes.STRING(32),
        url: DataTypes.STRING(120)
    }, {
        tableName: 'albums_photos',
        createdAt: false,
        updatedAt: false
        //classMethods: {
        //    associate: function (models) {
        //        AlbumPhoto.hasOne(models.albums, {foreignKey : 'albums_id'});
        //    }
        //}
    });
    return AlbumPhoto;
};
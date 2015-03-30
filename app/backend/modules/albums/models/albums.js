module.exports = function (sequelize, DataTypes) {
    var Albums = sequelize.define("albums", {
        artists_id: DataTypes.INTEGER,
        name: DataTypes.STRING(120),
        uri: DataTypes.STRING(120),
        rank: DataTypes.INTEGER,
        playcount: DataTypes.INTEGER,
        release_date: DataTypes.STRING(32),
        summary: DataTypes.STRING,
        href: DataTypes.STRING(32)
    }, {
        tableName: 'albums',
        createdAt: false,
        updatedAt: false
        //classMethods: {
        //    associate: function (models) {
        //        Albums.belongsTo(models.albums_photos);
        //    }
        //}
    });
    return Albums;
};
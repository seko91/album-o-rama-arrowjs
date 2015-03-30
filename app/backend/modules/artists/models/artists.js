module.exports = function (sequelize, DataTypes) {
    var Artists = sequelize.define("artists", {
        name: DataTypes.STRING(120),
        uri: DataTypes.STRING(120),
        listeners: DataTypes.INTEGER,
        biography: DataTypes.STRING
    }, {
        tableName: 'artists',
        createdAt: false,
        updatedAt: false
        //classMethods: {
        //    associate: function (models) {
        //        Albums.belongsTo(models.albums_photos);
        //    }
        //}
    });
    return Artists;
};
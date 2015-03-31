module.exports = function (sequelize, DataTypes) {
    var Artists = sequelize.define("artists", {
        name: DataTypes.STRING(120),
        uri: DataTypes.STRING(120),
        listeners: DataTypes.INTEGER,
        biography: DataTypes.STRING
    }, {
        tableName: 'artists',
        createdAt: false,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                Artists.hasMany(models.artists_photos, { foreignKey: 'artists_id' });
            }
        }
    });
    return Artists;
};
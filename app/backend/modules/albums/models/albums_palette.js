module.exports = function (sequelize, DataTypes) {
    var AlbumPalette = sequelize.define("albums_palette", {
        albums_id: DataTypes.INTEGER,
        color: DataTypes.STRING(16),
        uri: DataTypes.STRING(7)
    }, {
        tableName: 'albums_palette',
        createdAt: false,
        updatedAt: false
    });
    return AlbumPalette;
};
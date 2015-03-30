module.exports = function (sequelize, DataTypes) {
    var AlbumTrack = sequelize.define("albums_tracks", {
        albums_id: DataTypes.INTEGER,
        name: DataTypes.STRING(120),
        duration: DataTypes.STRING(12),
        rank: DataTypes.INTEGER,
        href: DataTypes.STRING(45)
    }, {
        tableName: 'albums_tracks',
        createdAt: false,
        updatedAt: false
    });
    return AlbumTrack;
};
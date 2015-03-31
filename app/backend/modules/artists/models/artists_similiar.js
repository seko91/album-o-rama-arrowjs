module.exports = function (sequelize, DataTypes) {
    var ArtistSimilar = sequelize.define("artists_similar", {
        artists_id: DataTypes.INTEGER,
        similar_artist_id: DataTypes.INTEGER
    }, {
        tableName: 'artists_similar',
        createdAt: false,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                ArtistSimilar.belongsTo(models.artists, {foreignKey : 'similar_artist_id'});
            }
        }
    });
    return ArtistSimilar;
};
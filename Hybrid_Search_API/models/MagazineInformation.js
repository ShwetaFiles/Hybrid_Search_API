const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as necessary

class MagazineInformation extends Model {}

MagazineInformation.init({
  // Define your fields here
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  publication_date: DataTypes.DATE,
  category: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'MagazineInformation',
});

MagazineInformation.associate = function(models) {
  MagazineInformation.hasMany(models.MagazineContent, {
    foreignKey: 'magazine_id',
    as: 'contents' // Alias for the association
  });
};

module.exports = MagazineInformation;

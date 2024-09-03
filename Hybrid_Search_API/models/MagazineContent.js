const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as necessary

class MagazineContent extends Model {}

MagazineContent.init({
  // Define your fields here
  content: DataTypes.TEXT,
  vector_representation: DataTypes.ARRAY(DataTypes.FLOAT), // Assuming vector is stored as an array of floats
  magazine_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'MagazineInformation',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'MagazineContent',
});

MagazineContent.associate = function(models) {
  MagazineContent.belongsTo(models.MagazineInformation, {
    foreignKey: 'magazine_id',
    as: 'magazine'
  });
};

module.exports = MagazineContent;

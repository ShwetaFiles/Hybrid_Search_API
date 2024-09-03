const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with your PostgreSQL database credentials
const sequelize = new Sequelize('hybrid_search_db', 'postgres', 'Keertanam@99', {
    host: 'localhost',
    dialect: 'postgres',
});

// Export the initialized Sequelize instance and DataTypes
module.exports = { sequelize, DataTypes };

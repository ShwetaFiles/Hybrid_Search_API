const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Sequelize with PostgreSQL database
const sequelize = new Sequelize('hybrid_search_db', 'postgres', 'Keertanam@99', {
    host: 'localhost',
    dialect: 'postgres',
});

// Define MagazineInformation model
const MagazineInformation = sequelize.define('MagazineInformation', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publication_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
});

// Define MagazineContent model
const MagazineContent = sequelize.define('MagazineContent', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  vector_representation: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
  },
  magazine_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MagazineInformation,
      key: 'id',
    },
  },
});

// Set up model associations
MagazineInformation.hasMany(MagazineContent, { foreignKey: 'magazine_id', as: 'contents' });
MagazineContent.belongsTo(MagazineInformation, { foreignKey: 'magazine_id', as: 'magazine' });

// Sync the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Hybrid Search API',
      version: '1.0.0',
      description: 'API documentation for the Hybrid Search API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Example route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Perform a search
 *     description: Use this endpoint to search by keyword, vector, or a combination of both (hybrid search).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchType:
 *                 type: string
 *                 enum: [keyword, vector, hybrid]
 *                 description: The type of search to perform.
 *                 example: hybrid
 *               keyword:
 *                 type: string
 *                 description: Keyword to search in title, author, and content.
 *               vector:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Vector representation for similarity search.
 *     responses:
 *       200:
 *         description: A list of search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   publication_date:
 *                     type: string
 *                     format: date
 *                   snippet:
 *                     type: string
 *                   relevance_score:
 *                     type: number
 */
app.post('/search', async (req, res) => {
    console.log('Received request:', req.body);
  
    const { searchType, keyword, vector } = req.body;
  
    try {
      let results = [];
  
      // Perform keyword search
      if (searchType === 'keyword' || searchType === 'hybrid') {
        try {
          const keywordResults = await MagazineInformation.findAll({
            where: {
              [Sequelize.Op.or]: [
                { title: { [Sequelize.Op.iLike]: `%${keyword}%` } },
                { author: { [Sequelize.Op.iLike]: `%${keyword}%` } },
                { '$contents.content$': { [Sequelize.Op.iLike]: `%${keyword}%` } }
              ]
            },
            include: [{
              model: MagazineContent,
              as: 'contents',
            }]
          });
          results.push(...keywordResults.map(r => r.toJSON()));
          console.log('Keyword results:', keywordResults);
        } catch (error) {
          console.error('Keyword search error:', error);
          return res.status(500).json({ error: 'Error performing keyword search' });
        }
      }
  
      // Perform vector search
      if (searchType === 'vector' || searchType === 'hybrid') {
        try {
          const vectorResults = await MagazineContent.findAll({
            where: {
              vector_representation: { [Sequelize.Op.contains]: vector }
            },
            include: [{
              model: MagazineInformation,
              as: 'magazine'
            }]
          });
          results.push(...vectorResults.map(vr => vr.toJSON()));
          console.log('Vector results:', vectorResults);
        } catch (error) {
          console.error('Vector search error:', error);
          return res.status(500).json({ error: 'Error performing vector search' });
        }
      }
  
      // Remove duplicates and rank results if hybrid search
      if (searchType === 'hybrid') {
        results = results.filter((result, index, self) =>
          index === self.findIndex((t) => (
            t.id === result.id
          ))
        );
        console.log('Combined hybrid results:', results);
      }
  
      res.json(results);
  
    } catch (error) {
      console.error('Error occurred during search:', error);
      res.status(500).json({ error: 'An error occurred while performing the search' });
    }
  });
  
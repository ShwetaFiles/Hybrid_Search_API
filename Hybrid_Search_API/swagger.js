const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Hybrid Search API',
            version: '1.0.0',
            description: 'API documentation for the Hybrid Search API',
            contact: {
                name: 'Your Name',
                email: 'your.email@example.com'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Development server'
                }
            ]
        },
    },
    apis: ['./index.js'], // Point to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;

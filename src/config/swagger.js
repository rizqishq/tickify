import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tickify API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Tickify Event Ticketing System',
        },
        servers: [
            {
                url: process.env.BACKEND_URL || 'http://localhost:5000/api',
                description: 'Development / Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/routes/admin/*.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);

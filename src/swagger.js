import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Express API with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:8000/api/v1',
            },
        ],
    },
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
export { swaggerSpec }
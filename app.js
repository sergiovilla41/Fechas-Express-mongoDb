const express = require('express');
const app = express();
const router = require('./Rutas/rutes'); 
const fechas = require('./Services/fechas');
// Importa la función connectToDatabase
const connectToDatabase = require('./Config/mongodb');

// Establece la conexión a la base de datos y luego inicia el servidor Express
connectToDatabase().then((db) => {
  console.log('Connected to MongoDB successfully');

  const { swaggerUi, specs } = require('./Config/swagger'); // Importa las configuraciones de Swagger

  // Usa el enrutador después de que la conexión se haya establecido
  app.use(router);
  
     // Agrega Swagger UI a tu aplicación
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  // Inicia el servidor Express después de que la conexión se haya establecido
  const PORT = 3030;
  app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
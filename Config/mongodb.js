const { MongoClient } = require('mongodb');

// URL de conexión a MongoDB
const uri = 'mongodb://localhost:27017';
const dbName = 'festivos';

// Función para conectar a la base de datos
async function connectToDatabase() {
  try {
    const options = {};

    const client = await MongoClient.connect(uri, options);
    console.log('Connected to MongoDB successfully');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
module.exports = connectToDatabase;

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST, // Ora punta all'IP/hostname remoto
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: { // Richiesto per connessioni cloud
      require: true,
      rejectUnauthorized: false // Solo per sviluppo, in produzione usare certificati validi
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

//const sequelize = new Sequelize('todoapp', 'postgres', 'yourpassword', {
//  host: 'localhost',
//  dialect: 'postgres',
//  logging: false
//});
//
const Todo = sequelize.define('Todo', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Crea le tabelle se non esistono
    console.log('✅ Connesso a PostgreSQL');
  } catch (err) {
    console.error('❌ Errore connessione PostgreSQL:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, Todo };

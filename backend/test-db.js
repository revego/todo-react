const { Sequelize } = require('sequelize');
require('dotenv').config();

async function test() {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connessione riuscita!');
  } catch (err) {
    console.error('❌ Errore:', err);
  } finally {
    await sequelize.close();
  }
}

test();

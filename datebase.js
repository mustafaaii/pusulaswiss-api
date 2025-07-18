const mysql = require('mysql2/promise');
const dbConfig = {
    host: '',
    user: '',
    password: '.',
    database: ''
};

async function getconnect() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        throw new Error('Veritabanı bağlantısı sağlanamadı');
    }
}

module.exports = { getconnect };

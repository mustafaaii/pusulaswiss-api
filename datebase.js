const mysql = require('mysql2/promise');
const dbConfig = {
    host: '46.202.134.193',
    user: 'pusula_root',
    password: '5302654Mm.',
    database: 'pusula_swiss'
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
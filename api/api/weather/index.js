const { getconnect } = require('../../../datebase');

const Weather = async (req, res) => {
    try {
        const connection = await getconnect();
        let [rows] = await connection.execute('SELECT * FROM weather WHERE DATE(date) = CURDATE()');
        if (rows.length === 0) {
            [rows] = await connection.execute('SELECT * FROM weather WHERE DATE(date) = CURDATE() - INTERVAL 1 DAY');
        }
        await connection.end();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Weather };

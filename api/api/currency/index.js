const { getconnect } = require('../../../datebase');

const Currency = async (req, res) => {
    try {
        const connection = await getconnect();

        // İlk olarak bugünün verisini almayı dene
        let [rows] = await connection.execute('SELECT * FROM currency WHERE DATE(date) = CURDATE()');

        // Eğer bugünün verisi yoksa, bir gün öncesinin verisini al
        if (rows.length === 0) {
            [rows] = await connection.execute('SELECT * FROM currency WHERE DATE(date) = CURDATE() - INTERVAL 1 DAY');
        }

        await connection.end();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Currency };

const { getconnect } = require('../../datebase');
const List = async (req, res) => {
    try {
        const connection = await getconnect();
        const [rows] = await connection.execute('SELECT * FROM postcategory');
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { List };

const { getconnect } = require('../../datebase');

const Detail = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Geçerli bir ID sağlamalısınız.' });
    }
    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`SELECT * FROM postcategory WHERE id = ?`, [id]);
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Detail };
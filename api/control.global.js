const { getconnect } = require('../datebase');
const Control = async (req, res) => {
    const { value, field, table } = req.body;
    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE ${field}=?`, [value]);
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Control };
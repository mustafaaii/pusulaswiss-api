const { getconnect } = require('../../datebase');
const Insert = async (req, res) => {
    const { postId, status, date } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`INSERT INTO post_plan (postId, status, date) VALUES (?,?,?)`, [postId, status, date]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
}
module.exports = Attrbute = { Insert };
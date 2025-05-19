const { getconnect } = require('../../datebase');
const Insert = async (req, res) => {
    const { postId, podcast } = req.body;
    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`INSERT INTO post_podcast (postId, podcast) VALUES (?,?)`, [postId, podcast]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: error });
    }
}
module.exports = Attrbute = { Insert };
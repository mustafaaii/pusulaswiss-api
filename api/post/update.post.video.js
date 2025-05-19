const { getconnect } = require('../../datebase');

const Update = async (req, res) => {
    const { postId, video } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`UPDATE post_video SET  video = ? WHERE postId = ?`, [video, postId]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = Attrbute = { Update };

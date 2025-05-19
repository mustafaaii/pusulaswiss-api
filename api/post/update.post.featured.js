const { getconnect } = require('../../datebase');

const Update = async (req, res) => {
    const { postId, status, image, date } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`UPDATE post_featured SET status = ?, image = ?, date = ? WHERE postId = ?`, [status, image, date, postId]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = Attrbute = { Update };

const { getconnect } = require('../../datebase');

const Post = async (req, res) => {
    const { id, limit } = req.body;

    if (!id || !limit) {
        return res.status(400).json({ error: 'Geçerli bir Parametre sağlamalısınız.' });
    }

    try {
        const connection = await getconnect();
        const [[{ totalCount }]] = await connection.execute('SELECT COUNT(*) AS totalCount FROM post WHERE createdBy = ?', [id]);
        const [rows] = await connection.execute('SELECT * FROM post WHERE createdBy=? ORDER BY createdDate DESC LIMIT ? ', [id, limit]);
        await connection.end();
        res.status(200).json({ data: rows, totalCount, id, limit });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Post };
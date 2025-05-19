const { getconnect } = require('../../datebase');

const Delete = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Geçerli bir postId sağlamalısınız.' });
    }
    try {
        const connection = await getconnect();
        await connection.execute(`DELETE FROM banner WHERE id = ?`, [id]);
        await connection.end();
        res.status(200).json({ status: true });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Delete };

const { getconnect } = require('../../datebase');

const Navigation = async (req, res) => {
    const { postId, createdBy } = req.body; // createdBy opsiyonel olabilir

    if (!postId) {
        return res.status(400).json({ error: 'Geçerli bir postId sağlamalısınız.' });
    }

    try {
        const connection = await getconnect();

        const [postRows] = await connection.execute(
            'SELECT id, category FROM post WHERE postId = ?',
            [postId]
        );

        if (postRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Haber bulunamadı.' });
        }

        const { id, category } = postRows[0];

        let prevQuery = 'SELECT * FROM post WHERE category = ? AND id < ?';
        let nextQuery = 'SELECT * FROM post WHERE category = ? AND id > ?';
        let queryParamsPrev = [category, id];
        let queryParamsNext = [category, id];

        if (createdBy) {
            prevQuery += ' AND createdBy = ?';
            nextQuery += ' AND createdBy = ?';
            queryParamsPrev.push(createdBy);
            queryParamsNext.push(createdBy);
        }

        prevQuery += ' ORDER BY id DESC LIMIT 1';
        nextQuery += ' ORDER BY id ASC LIMIT 1';

        const [prevRows] = await connection.execute(prevQuery, queryParamsPrev);
        const [nextRows] = await connection.execute(nextQuery, queryParamsNext);
        await connection.end();
        res.status(200).json({ prevPost: prevRows[0] || null, nextPost: nextRows[0] || null });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Navigation };

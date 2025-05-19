const { getconnect } = require('../../datebase');

const Search = async (req, res) => {
    const { search, limit } = req.body;

    if (!search) {
        return res.status(400).json({ error: 'Arama için bir kelime girmelisiniz.' });
    }

    try {
        const connection = await getconnect();
        const query = `
            SELECT p.*, pc.name AS categoryName 
            FROM post p
            LEFT JOIN postcategory pc ON p.category = pc.id
            WHERE p.title LIKE ? OR pc.name LIKE ?
            ORDER BY p.createdDate DESC
            LIMIT ?;
        `;

        const [rows] = await connection.execute(query, [`%${search}%`, `%${search}%`, Number(limit) || 10]);

        await connection.end();

        res.status(200).json({
            status: true,
            data: rows
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Search };

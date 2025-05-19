const { getconnect } = require('../../datebase');

const Table = async (req, res) => {
    const { p, l, o, s } = req.body;

    const page = p ? parseInt(p, 10) || 1 : 1;
    const limit = l ? parseInt(l, 10) || 10 : 10;
    const order = o && o.toUpperCase() === "ASC" ? "ASC" : "DESC";
    let search = s ? `%${decodeURIComponent(s)}%` : null;
    const offset = (page - 1) * limit;

    try {
        const connection = await getconnect();

        let writerQuery = `
            SELECT 
                w.*,
                COUNT(p.postId) as postCount
            FROM 
                authors w
            LEFT JOIN 
                post p ON p.createdBy = w.id
        `;

        let countQuery = `SELECT COUNT(*) as total FROM authors`;
        let queryParams = [];

        if (search) {
            writerQuery += ` WHERE w.name LIKE ? OR w.surname LIKE ?`;
            countQuery += ` WHERE name LIKE ? OR surname LIKE ?`;
            queryParams.push(search, search);
        }

        writerQuery += `
            GROUP BY w.id
            ORDER BY w.createdDate ${order}
            LIMIT ? OFFSET ?
        `;
        queryParams.push(limit, offset);

        const [writersRaw] = await connection.execute(writerQuery, queryParams);
        const [[totalRow]] = await connection.execute(countQuery, queryParams);
        const totalWriters = totalRow.total;
        const totalPages = Math.ceil(totalWriters / limit);

        const writers = writersRaw.map(w => ({
            ...w,
            posts: w.postCount
        }));

        return res.json({
            writers,
            totalWriters,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Table };

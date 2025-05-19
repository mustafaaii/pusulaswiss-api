const { getconnect } = require('../../datebase');

const Table = async (req, res) => {
    const { p, l, o, s } = req.body;

    const page = p ? parseInt(p, 10) || 1 : 1;
    const limit = l ? parseInt(l, 10) || 10 : 10;
    const order = o && o.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const search = s ? `%${decodeURIComponent(s)}%` : null;
    const offset = (page - 1) * limit;

    try {
        const connection = await getconnect();

        let categoryQuery = `
            SELECT 
                pc.*, 
                COUNT(p.postId) AS posts
            FROM postcategory pc
            LEFT JOIN post p ON p.category = pc.id
        `;

        let countQuery = `SELECT COUNT(*) as total FROM postcategory`;
        const queryParams = [];

        if (search) {
            categoryQuery += ` WHERE pc.name LIKE ?`;
            countQuery += ` WHERE name LIKE ?`;
            queryParams.push(search);
        }

        categoryQuery += `
            GROUP BY pc.id
            ORDER BY pc.id ${order}
            LIMIT ? OFFSET ?
        `;
        queryParams.push(limit, offset);

        const [categoriesRaw] = await connection.execute(categoryQuery, queryParams);
        const [[totalRow]] = await connection.execute(countQuery, search ? [search] : []);
        const totalCategories = totalRow.total;
        const totalPages = Math.ceil(totalCategories / limit);

        return res.json({
            categories: categoriesRaw,
            totalCategories,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Table };

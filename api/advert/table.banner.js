const { getconnect } = require('../../datebase');

const Table = async (req, res) => {
    const { p, l, o, s } = req.body;

    const page = p ? parseInt(p, 10) || 1 : 1;
    const limit = l ? parseInt(l, 10) || 10 : 10;
    const order = o && o.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const offset = (page - 1) * limit;
    const search = s ? `%${decodeURIComponent(s)}%` : null;

    try {
        const connection = await getconnect();

        let bannerQuery = `SELECT * FROM banner`;
        let countQuery = `SELECT COUNT(*) as total FROM banner`;
        const queryParams = [];

        if (search) {
            bannerQuery += ` WHERE name LIKE ?`;
            countQuery += ` WHERE name LIKE ?`;
            queryParams.push(search);
        }

        bannerQuery += ` ORDER BY createdDate ${order} LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        const [bannersRaw] = await connection.execute(bannerQuery, queryParams);
        const [[totalRow]] = await connection.execute(countQuery, search ? [search] : []);
        const totalBanners = totalRow.total;
        const totalPages = Math.ceil(totalBanners / limit);

        return res.json({
            data: bannersRaw,
            totalBanners,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: error });
    }
};

module.exports = { Table };

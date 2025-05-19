const { getconnect } = require('../../datebase');

const Breaking = async (req, res) => {
    try {
        const connection = await getconnect();
        await connection.execute(`SET lc_time_names = 'tr_TR'`);
        // Bugünün haberlerini al
        const [todayRows] = await connection.execute(`
            SELECT post.*, authors.name AS createdByName, 
                   DATE_FORMAT(post.createdDate, '%d %M %Y') AS createdDateFormat,
                   postcategory.name AS categoryName
            FROM post
            LEFT JOIN authors ON post.createdBy = authors.id
            LEFT JOIN postcategory ON post.category = postcategory.id
            WHERE DATE(post.createdDate) = CURDATE()
            ORDER BY post.createdDate DESC
        `);

        let data = todayRows;

        if (data.length < 30) {
            const eksikSayi = 30 - data.length;

            const [previousRows] = await connection.execute(`
                SELECT post.*, authors.name AS createdByName, 
                       DATE_FORMAT(post.createdDate, '%d %M %Y') AS createdDateFormat,
                       postcategory.name AS categoryName
                FROM post
                LEFT JOIN authors ON post.createdBy = authors.id
                LEFT JOIN postcategory ON post.category = postcategory.id
                WHERE DATE(post.createdDate) < CURDATE()
                ORDER BY post.createdDate DESC
                LIMIT ?
            `, [eksikSayi]);

            data = [...data, ...previousRows];
        }

        await connection.end();
        res.status(200).json({ data });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Breaking };

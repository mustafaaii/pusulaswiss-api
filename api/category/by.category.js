const { getconnect } = require('../../datebase');

const By = async (req, res) => {
    try {
        const connection = await getconnect();

        const [columns] = await connection.execute(`SHOW COLUMNS FROM post`);
        const columnNames = columns.map(col => `'${col.Field}', ${col.Field}`).join(', ');

        const extraFields = `'categoryName', categoryName, 
            'createdByName', CONCAT(name, ' ', surname),
            'createdDateFormat', CONCAT(
                DAY(createdDate), ' ',
                CASE MONTH(createdDate)
                    WHEN 1 THEN 'Ocak'
                    WHEN 2 THEN 'Şubat'
                    WHEN 3 THEN 'Mart'
                    WHEN 4 THEN 'Nisan'
                    WHEN 5 THEN 'Mayıs'
                    WHEN 6 THEN 'Haziran'
                    WHEN 7 THEN 'Temmuz'
                    WHEN 8 THEN 'Ağustos'
                    WHEN 9 THEN 'Eylül'
                    WHEN 10 THEN 'Ekim'
                    WHEN 11 THEN 'Kasım'
                    WHEN 12 THEN 'Aralık'
                END,
                ' ', YEAR(createdDate)
            )`;

        const query = `
            WITH RankedPosts AS (
                SELECT 
                    p.*, 
                    pc.name AS categoryName,
                    a.name,
                    a.surname,
                    ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY p.createdDate DESC, p.id DESC) AS row_num
                FROM post p
                LEFT JOIN postcategory pc ON p.category = pc.id
                LEFT JOIN authors a ON p.createdBy = a.id
            ),
            Filtered AS (
                SELECT * FROM RankedPosts WHERE row_num <= 15
            )
            SELECT 
                category,
                categoryName,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(${columnNames}, ${extraFields})
                        ORDER BY createdDate DESC, id DESC
                    ), '[]'
                ) AS posts
            FROM Filtered
            GROUP BY category, categoryName;
        `;

        const [rows] = await connection.execute(query);

        const allPosts = rows.flatMap(row => row.posts ? JSON.parse(row.posts) : []);
        const postIds = allPosts.map(post => post.postId);

        let attributes = {};
        let events = {};

        if (postIds.length > 0) {
            const placeholders = postIds.map(() => '?').join(',');

            const [attrRows] = await connection.execute(
                `SELECT * FROM postattribute WHERE postId IN (${placeholders})`,
                postIds
            );

            const [eventRows] = await connection.execute(
                `SELECT * FROM postevent WHERE postId IN (${placeholders})`,
                postIds
            );

            attributes = postIds.reduce((acc, id) => ({ ...acc, [id]: [] }), {});
            events = postIds.reduce((acc, id) => ({ ...acc, [id]: [] }), {});

            attrRows.forEach(attr => {
                if (!attributes[attr.postId]) attributes[attr.postId] = [];
                attributes[attr.postId].push(attr);
            });

            eventRows.forEach(event => {
                if (!events[event.postId]) events[event.postId] = [];
                events[event.postId].push(event);
            });
        }

        await connection.end();

        const formattedRows = rows.map(row => ({
            category: row.category,
            categoryName: row.categoryName,
            posts: row.posts ? JSON.parse(row.posts).map(post => ({
                ...post,
                attribute: attributes[post.postId] || [],
                event: events[post.postId] || []
            })) : []
        }));

        const PlanDate = (e) => {
            if (e.length > 0) {
                const r = e.filter(f => f.planPost === 1);
                if (r.length > 0) {
                    const current = new Date().toISOString().split("T")[0];
                    const targets = r[0]["planDate"];
                    if (current === targets) {
                        const currHour = new Date().getHours();
                        const currMinute = new Date().getMinutes();
                        const targetHour = Number(r[0]["planHour"]);
                        const targetMinute = Number(r[0]["planMinute"]);
                        if (currHour > targetHour || (currHour === targetHour && currMinute >= targetMinute)) {
                            return false;
                        } else {
                            return r[0]["postId"];
                        }
                    } else if (current > targets) {
                        return r[0]["postId"];
                    }
                }
            }
            return false;
        };

        const plan = formattedRows.map(category => ({
            ...category,
            posts: category.posts.filter(post => post.postId !== PlanDate(post.attribute))
        }));

        const status = plan.map(category => ({
            ...category,
            posts: category.posts.filter(post => Number(post.status) === 1)
        }));

        res.status(200).json(status);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { By };

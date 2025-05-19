const { getconnect } = require('../../datebase');

const Post = async (req, res) => {
    const { id, limit, offset = 0, createdBy = null } = req.body;

    if (!id || !limit) {
        return res.status(400).json({ error: 'Geçerli bir Parametre sağlamalısınız.' });
    }

    try {
        const connection = await getconnect();

        // 1. Toplam sayıyı al
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM post WHERE category = ?';
        let countParams = [id];

        if (createdBy !== undefined && createdBy !== null && createdBy !== '') {
            countQuery += ' AND createdBy = ?';
            countParams.push(createdBy);
        }

        const [[{ totalCount }]] = await connection.execute(countQuery, countParams);

        // 2. Post listesini al
        let postQuery = `
            SELECT 
                p.*,
                pc.name AS categoryName,
                CONCAT(a.name, ' ', a.surname) AS createdByName,
                CONCAT(
                    DAY(p.createdDate), ' ',
                    CASE MONTH(p.createdDate)
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
                    ' ', YEAR(p.createdDate)
                ) AS createdDateFormat
            FROM post p
            LEFT JOIN postcategory pc ON p.category = pc.id
            LEFT JOIN authors a ON p.createdBy = a.id
            WHERE p.category = ?
        `;

        const queryParams = [id];

        if (createdBy !== undefined && createdBy !== null && createdBy !== '') {
            postQuery += ' AND p.createdBy = ?';
            queryParams.push(createdBy);
        }

        postQuery += ' ORDER BY p.createdDate DESC, p.id DESC LIMIT ? OFFSET ?';
        queryParams.push(Number(limit), Number(offset));

        const [rows] = await connection.execute(postQuery, queryParams);
        const postIds = rows.map(post => post.postId);

        // Alt verileri yükle
        const loadData = async (table) => {
            if (postIds.length === 0) return {};
            const placeholders = postIds.map(() => '?').join(',');
            const [data] = await connection.execute(
                `SELECT * FROM ${table} WHERE postId IN (${placeholders})`,
                postIds
            );
            return data.reduce((acc, item) => {
                if (!acc[item.postId]) acc[item.postId] = [];
                acc[item.postId].push(item);
                return acc;
            }, {});
        };

        const featured = await loadData('post_featured');
        const podcast = await loadData('post_podcast');
        const galery = await loadData('post_galery');
        const video = await loadData('post_video');
        const event = await loadData('post_event');
        const plan = await loadData('post_plan');

        await connection.end();

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

        // Geri döndür
        const enrichedRows = rows.map(post => ({
            ...post,
            featured: featured[post.postId] || [],
            podcast: podcast[post.postId] || [],
            galery: galery[post.postId] || [],
            video: video[post.postId] || [],
            event: event[post.postId] || [],
            plan: plan[post.postId] || []
        }));

        const planFiltered = enrichedRows.filter(post => post.postId !== PlanDate(post.plan));
        const statusFiltered = planFiltered.filter(post => Number(post.status) === 1);

        res.status(200).json({
            data: statusFiltered,
            totalCount,
            id,
            limit,
            offset
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};


module.exports = { Post };

const { getconnect } = require('../../datebase');

const Dates = async (req, res) => {
    const { id, limit } = req.body;

    try {
        const connection = await getconnect();
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM post WHERE DATE(createdDate) = ?';
        let postQuery = 'SELECT * FROM post WHERE DATE(createdDate) = ?';
        let queryParams = [id];

        postQuery += ' ORDER BY createdDate DESC LIMIT ?';
        queryParams.push(Number(limit));

        const [[{ totalCount }]] = await connection.execute(countQuery, queryParams.slice(0, -1));
        const [rows] = await connection.execute(postQuery, queryParams);
        const postIds = rows.map(post => post.postId);
        let attributes = {};
        let events = {};

        if (postIds.length > 0) {
            const placeholders = postIds.map(() => '?').join(',');
            const [attributeRow] = await connection.execute(`SELECT * FROM postattribute WHERE postId IN (${placeholders})`, postIds);
            const [eventRow] = await connection.execute(`SELECT * FROM postevent WHERE postId IN (${placeholders})`, postIds);
            attributes = postIds.reduce((acc, id) => ({ ...acc, [id]: [] }), {});
            events = postIds.reduce((acc, id) => ({ ...acc, [id]: [] }), {});
            attributeRow.forEach(attr => { if (!attributes[attr.postId]) attributes[attr.postId] = []; attributes[attr.postId].push(attr); });
            eventRow.forEach(event => { if (!events[event.postId]) events[event.postId] = []; events[event.postId].push(event); });
        }
        await connection.end();
        const enrichedRows = rows.map(post => ({ ...post, attributes: attributes[post.postId] || [], events: events[post.postId] || [] }));

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
        const plan = enrichedRows.filter(post => post.postId !== PlanDate(post.attributes));
        const status = plan.filter(post => Number(post.status) === 1);
        res.status(200).json({
            data: status,
            totalCount,
            id,
            limit
        });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Dates };



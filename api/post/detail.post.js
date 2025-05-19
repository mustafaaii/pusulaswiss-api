const { getconnect } = require('../../datebase');

const Detail = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Geçerli bir ID sağlamalısınız.' });
    }

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`
            SELECT p.*, c.name AS categoryName 
            FROM post p 
            LEFT JOIN postcategory c ON p.category = c.id 
            WHERE p.postId = ?
        `, [id]);

        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Post bulunamadı' });
        }

        const post = rows[0];

        // createdDateFormat: Türkçe formatta tarih
        if (post.createdDate) {
            const date = new Date(post.createdDate);
            post.createdDateFormat = date.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }

        const [featured] = await connection.execute(`SELECT * FROM post_featured WHERE postId = ?`, [id]);
        const [podcast] = await connection.execute(`SELECT * FROM post_podcast WHERE postId = ?`, [id]);
        const [galery] = await connection.execute(`SELECT * FROM post_galery WHERE postId = ?`, [id]);
        const [video] = await connection.execute(`SELECT * FROM post_video WHERE postId = ?`, [id]);
        const [event] = await connection.execute(`SELECT * FROM post_event WHERE postId = ?`, [id]);
        const [plan] = await connection.execute(`SELECT * FROM post_plan WHERE postId = ?`, [id]);

        await connection.end();

        post.featured = featured;
        post.podcast = podcast;
        post.galery = galery;
        post.video = video;
        post.event = event;
        post.plan = plan;

        res.status(200).json(post);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Detail };

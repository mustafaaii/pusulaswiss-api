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

        let postQuery = `
            SELECT post.*, 
                   postcategory.name AS categoryName,
                   CONCAT(authors.name, ' ', authors.surname) AS createdByName
            FROM post 
            LEFT JOIN postcategory ON post.category = postcategory.id
            LEFT JOIN authors ON post.createdBy = authors.id
        `;

        let countQuery = `SELECT COUNT(*) as total FROM post`;
        let queryParams = [];

        if (search) {
            postQuery += ` WHERE post.title LIKE ?`;
            countQuery += ` WHERE post.title LIKE ?`;
            queryParams.push(search);
        }

        postQuery += ` ORDER BY post.createdDate ${order} LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        const [postsRaw] = await connection.execute(postQuery, queryParams);
        const [[totalRow]] = await connection.execute(countQuery, queryParams);
        const totalPosts = totalRow.total;
        const totalPages = Math.ceil(totalPosts / limit);

        if (postsRaw.length === 0) {
            return res.json({
                posts: [],
                totalPosts,
                totalPages,
                currentPage: page,
            });
        }

        // Ayrıştırma
        const posts = postsRaw.map(post => {
            const { categoryName, createdByName, ...rest } = post;
            return {
                ...rest,
                categoryName,
                createdByName
            };
        });

        const postIds = posts.map(post => post.postId);

        const [featured] = await connection.execute(`SELECT * FROM post_featured WHERE postId IN (${postIds.map(() => "?").join(",")})`, postIds);
        const [podcast] = await connection.execute(`SELECT * FROM post_podcast WHERE postId IN (${postIds.map(() => "?").join(",")})`, postIds);
        const [galery] = await connection.execute(`SELECT * FROM post_galery WHERE postId IN (${postIds.map(() => "?").join(",")})`, postIds);
        const [video] = await connection.execute(`SELECT * FROM post_video WHERE postId IN (${postIds.map(() => "?").join(",")})`, postIds);
        const [event] = await connection.execute(`SELECT * FROM post_event WHERE postId IN (${postIds.map(() => "?").join(",")})`, postIds);
        const [plan] = await connection.execute(`SELECT * FROM post_plan WHERE postId IN (${postIds.map(() => "?").join(",")})`, postIds);

        const aylar = [
            "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ];

        const postsWithExtras = posts.map(post => {
            const postFeatured = featured.filter(attr => attr.postId === post.postId);
            const postPodcast = podcast.filter(ev => ev.postId === post.postId);
            const postGalery = galery.filter(ev => ev.postId === post.postId);
            const postVideo = video.filter(ev => ev.postId === post.postId);
            const postEvent = event.filter(ev => ev.postId === post.postId);
            const postPlan = plan.filter(ev => ev.postId === post.postId);

            const tarih = new Date(post.createdDate);
            const gun = tarih.getDate();
            const ay = aylar[tarih.getMonth()];
            const yil = tarih.getFullYear();
            const createdDateFormat = `${gun} ${ay} ${yil}`;

            return {
                ...post,
                featured: postFeatured,
                podcast: postPodcast,
                galery: postGalery,
                video: postVideo,
                event: postEvent,
                plan: postPlan,
                createdDateFormat
            };
        });

        return res.json({
            posts: postsWithExtras,
            totalPosts,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Table };

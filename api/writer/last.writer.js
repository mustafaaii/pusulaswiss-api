const { getconnect } = require('../../datebase');

const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function formatTarih(tarihStr) {
    const tarih = new Date(tarihStr);
    const gun = gunler[tarih.getDay()];
    const ay = aylar[tarih.getMonth()];
    return `${tarih.getDate()} ${ay} ${tarih.getFullYear()}`;
}

const Last = async (req, res) => {
    const { id, limit = 1 } = req.body;
    try {
        const connection = await getconnect();

        const [authors] = id
            ? await connection.execute('SELECT * FROM authors WHERE id != ?', [Number(id)])
            : await connection.execute('SELECT * FROM authors');

        const data = await Promise.all(
            authors.map(async (author) => {
                const [posts] = await connection.execute(
                    'SELECT p.*, c.name AS categoryName FROM post p LEFT JOIN postcategory c ON c.id = p.category WHERE p.createdBy = ? AND p.category = 8 ORDER BY p.createdDate DESC LIMIT ?',
                    [author.id, Number(limit)]
                );

                const formattedPosts = posts.map(post => ({
                    ...post,
                    createdDateFormat: formatTarih(post.createdDate),
                }));

                return {
                    id: author.id,
                    writer: author,
                    posts: limit > 1 ? formattedPosts : formattedPosts[0] || null
                };
            })
        );

        await connection.end();
        res.status(200).json({ data });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Last };

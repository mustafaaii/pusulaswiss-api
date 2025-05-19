const { getconnect } = require('../../datebase');

const Update = async (req, res) => {
    const {
        id,
        name,
        view,
        size,
        image,
        category,
        startDate,
        endDate,
        status
    } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`
            UPDATE banner SET
                name = ?,
                view = ?,
                size = ?,
                image = ?,
                category = ?,
                startDate = ?,
                endDate = ?,
                status =?
            WHERE id = ?`,
            [
                name,
                view,
                size,
                image,
                category,
                startDate,
                endDate,
                status,
                id
            ]
        );

        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
}

module.exports = Attrbute = { Update };

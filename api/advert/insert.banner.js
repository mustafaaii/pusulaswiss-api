const { getconnect } = require('../../datebase');

const Insert = async (req, res) => {
    const {
        name,
        view,
        size,
        image,
        category,
        startDate,
        endDate,
        createdBy,
        createdDate,
        status
    } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`INSERT INTO banner 
            (
                name,
                view,
                size,
                image,
                category,
                startDate,
                endDate,
                createdBy,
                createdDate,
                status
            ) 
            VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
                name,
                view,
                size,
                image,
                category,
                startDate,
                endDate,
                createdBy,
                createdDate,
                status
            ]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
}
module.exports = Attrbute = { Insert };
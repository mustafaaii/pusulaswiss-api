const { getconnect } = require('../../datebase');

const Insert = async (req, res) => {
    const {
        postId,
        artist,
        organizer,
        web,
        ticket,
        content,
        openDate,
        startDate,
        galery,
        video,
        sponsor,
        location,
        maps
    } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`INSERT INTO post_event 
            (
                postId,
                artist,
                organizer,
                web,
                ticket,
                content,
                openDate,
                startDate,
                galery,
                video,
                sponsor,
                location,
                maps
            ) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                postId,
                artist,
                organizer,
                web,
                ticket,
                content,
                openDate,
                startDate,
                galery,
                video,
                sponsor,
                location,
                maps
            ]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
}
module.exports = Attrbute = { Insert };
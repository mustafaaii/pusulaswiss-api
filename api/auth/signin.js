const { getconnect } = require('../../datebase');
const Signin = async (req, res) => {
    const { email } = req.body;
    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`SELECT * FROM authors WHERE email = ?`, [email]);
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = { Signin };

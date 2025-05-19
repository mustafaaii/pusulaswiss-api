const { getconnect } = require('../../datebase');

const Update = async (req, res) => {
    const {
        id,
        token,
        online
    } = req.body;
    try {

        const connection = await getconnect();
        await connection.execute(`UPDATE authors SET token = ?, online = ? WHERE authorId = ?`, [token, online, id]);
        await connection.end();
        res.status(200).json({ message: 'Post başarıyla güncellendi' });
    } catch (error) {
        res.status(200).json({ error: error });
    }
};

module.exports = { Update };

const { getconnect } = require('../../datebase');

const Delete = async (req, res) => {
    const { id } = req.body;
    const connection = await getconnect();
    await connection.execute(`DELETE FROM authors WHERE id = ?`, [id]);
    await connection.end();
    res.status(200).json({ status: true });
};

module.exports = { Delete };
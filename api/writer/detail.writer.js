

const { getconnect } = require('../../datebase');

const Detail = async (req, res) => {
    const { id, field = "authorId" } = req.body;
    const connection = await getconnect();
    const [rows] = await connection.execute(`SELECT * FROM authors WHERE ${field} = ?`, [id]);
    await connection.end();
    if (rows.length > 0) {
        return res.status(200).json({ data: rows, status: true });
    }
    else {
        return res.status(200).json({ data: rows, status: false });
    }
};
module.exports = { Detail };
const { getconnect } = require('../datebase');
const Delete = async (req, res) => {
    const { id, table, field } = req.body;
    const connection = await getconnect();
    await connection.execute(`DELETE FROM ${table} WHERE ${field} = ?`, [id]);
    await connection.end();
    res.status(200).json({ status: true });
};

module.exports = { Delete };
const { getconnect } = require('../datebase');
const Select = async (req, res) => {
    const { id, table, field } = req.body;
    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE ${field}=?`, [id]);
        await connection.end();
        if (rows.length > 0) {
            res.status(200).json({ status: true, data: rows });
        } else {
            res.status(200).json({ status: false, data: [] });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports = { Select };

const { getconnect } = require('../../datebase');
const Insert = async (req, res) => {
    const { postId, video } = req.body;
    const connection = await getconnect();
    const [rows] = await connection.execute(`INSERT INTO post_video (postId, video) VALUES (?,?)`, [postId, video]);
    await connection.end();
    return res.status(200).json({ data: rows, status: true });
}
module.exports = Attrbute = { Insert };
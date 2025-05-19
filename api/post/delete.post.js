const { getconnect } = require('../../datebase');

const Delete = async (req, res) => {
    const { id } = req.body;
    const connection = await getconnect();
    await connection.execute(`DELETE FROM post WHERE postId = ?`, [id]);
    await connection.execute(`DELETE FROM post_plan WHERE postId = ?`, [id]);
    await connection.execute(`DELETE FROM post_event WHERE postId = ?`, [id]);
    await connection.execute(`DELETE FROM post_video WHERE postId = ?`, [id]);
    await connection.execute(`DELETE FROM post_galery WHERE postId = ?`, [id]);
    await connection.execute(`DELETE FROM post_podcast WHERE postId = ?`, [id]);
    await connection.execute(`DELETE FROM post_featured WHERE postId = ?`, [id]);
    await connection.end();
    res.status(200).json({ status: true });
};

module.exports = { Delete };
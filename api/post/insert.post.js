

const { getconnect } = require('../../datebase');

const Insert = async (req, res) => {

    const {
        postId,
        title,
        sortTitle,
        text,
        sortText,
        seoKeyword,
        preview,
        previewCo,
        createdBy,
        createdDate,
        category,
        status

    } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`INSERT INTO post (
                postId,
                title,
                sortTitle,
                text,
                sortText,
                seoKeyword,
                preview,
                previewCo,
                createdBy,
                createdDate,
                category,
                status
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                postId,
                title,
                sortTitle,
                text,
                sortText,
                seoKeyword,
                preview,
                previewCo,
                createdBy,
                createdDate,
                category,
                status,
            ]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        return res.status(200).json({ message: 'Hata', error: error.message, status: false });
    }
}

module.exports = { Insert };
const { getconnect } = require('../../datebase');

const Update = async (req, res) => {
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

        const [rows] = await connection.execute(`
            UPDATE post SET 
                title = ?,
                sortTitle = ?,
                text = ?,
                sortText = ?,
                seoKeyword = ?,
                preview = ?,
                previewCo = ?,
                createdBy = ?,
                createdDate = ?,
                category = ?,
                status = ?
            WHERE postId = ?
        `, [
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
            postId
        ]);

        await connection.end();
        return res.status(200).json({
            data: rows, status: true

        });

    } catch (error) {
        return res.status(200).json({
            message: 'Hata', error: error.message, status: false, data: [
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
            ]
        });
    }
};

module.exports = { Update };

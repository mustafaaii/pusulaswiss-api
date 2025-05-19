const { getconnect } = require('../../datebase');

const Update = async (req, res) => {
    const {
        authorId,
        name,
        surname,
        biography,
        email,
        photo,
        instagram,
        facebook,
        linkedin,
        cPassword
    } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(
            `UPDATE authors SET
                name = ?, 
                surname = ?, 
                biography = ?, 
                email = ?, 
                photo = ?, 
                instagram = ?, 
                facebook = ?, 
                linkedin = ?, 
                password = ?
            WHERE authorId = ?`,
            [
                name,
                surname,
                biography,
                email,
                photo,
                instagram,
                facebook,
                linkedin,
                cPassword,
                authorId
            ]
        );
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        return res.status(200).json({
            message: 'Hata', error: error.message, status: false
        });
    }


}
module.exports = { Update };
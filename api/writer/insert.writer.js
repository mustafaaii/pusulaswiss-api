const { getconnect } = require('../../datebase');

const Insert = async (req, res) => {
    const {
        authorId,
        name,
        surname,
        type,
        biography,
        email,
        photo,
        instagram,
        facebook,
        linkedin,
        status,
        online,
        passwords,
        createdDate
    } = req.body;

    try {
        const connection = await getconnect();
        const [rows] = await connection.execute(`INSERT INTO authors (
                authorId,
                name,
                surname,
                type,
                biography,
                email,
                photo,
                instagram,
                facebook,
                linkedin,
                status,
                online,
                password,
                createdDate
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                authorId,
                name,
                surname,
                type,
                biography,
                email,
                photo,
                instagram,
                facebook,
                linkedin,
                status,
                online,
                passwords,
                createdDate
            ]);
        await connection.end();
        return res.status(200).json({ data: rows, status: true });
    } catch (error) {
        return res.status(200).json({
            message: 'Hata', error: error.message, status: false
        });
    }


}
module.exports = { Insert };
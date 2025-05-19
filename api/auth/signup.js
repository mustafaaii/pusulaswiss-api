

const { getconnect } = require('../../datebase');

const Signup = async (req, res) => {
    const {
        id,
        name,
        surname,
        type,
        email,
        status,
        online,
        passw,
        termsofuse,
        termsofservice,
        advertising,
        useofcookies
    } = req.body;

    try {

        const now = new Date();
        now.setHours(now.getHours() + 3); 
        const current = now.toISOString().slice(0, 19).replace("T", " ");

        const connection = await getconnect();
        await connection.execute(`INSERT INTO authors (
            authorId, 
            name, 
            surname, 
            type, 
            email, 
            status,
            online,
            createdDate,
            password, 
            termsofuse,
            termsofservice,
            advertising,
            useofcookies
            ) 
            VALUES 
            (
             ?, 
             ?, 
             ?, 
             ?, 
             ?, 
             ?, 
             ?, 
             ?, 
             ?,
             ?,
             ?,
             ?,
             ?
             )`,
            [
                id,
                name,
                surname,
                type,
                email,
                status,
                online,
                current,
                passw,
                termsofuse,
                termsofservice,
                advertising,
                useofcookies
            ]);
        await connection.end();

        res.status(200).json({ status: true });
    } catch (error) {
        res.status(200).json({ status: false });
    }
};

module.exports = { Signup };



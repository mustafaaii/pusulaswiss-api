const crypto = require('crypto');


const Bcrypt = async (req, res) => {
    const { cPassword, hPassword } = req.body;
    try {
        const response = crypto.createHash('md5').update(cPassword).digest('hex');
        if (response === hPassword) {
            return res.status(200).json(true);
        } else {
            return res.status(200).json(false);
        }
    } catch (error) {
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = Bcrypt;
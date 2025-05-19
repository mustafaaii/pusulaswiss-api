const crypto = require('crypto');

const Crypto = async (req, res) => {
    const { cPassword } = req.body;
    try {
        const response = crypto.createHash('md5').update(cPassword).digest('hex');
        return res.status(200).json(response);
    } catch (error) {
        res.status(200).json({ error: 'Veritabanına bağlanırken hata oluştu' });
    }
};

module.exports = Crypto;
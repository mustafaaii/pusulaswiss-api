const crypto = require('crypto');
const Token = async (req, res) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-.";
    const length = 32;
    let token = "";

    for (let i = 0; i < length; i++) {
        token += characters.charAt(crypto.randomInt(0, characters.length));
    }

    res.status(200).json({ token });
};

module.exports = { Token };
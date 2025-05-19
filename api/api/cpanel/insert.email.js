
const { default: axios } = require('axios');
const { getconnect } = require('../../../datebase');

const Insert = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(200).json({ error: "Only POST requests are allowed" });
    }

    const id = 1;
    const connection = await getconnect();
    const [rows] = await connection.execute('SELECT * FROM mailapi WHERE id = ? ', [id]);
    const cpanelUsername = rows[0]["username"];
    const cpanelToken = rows[0]["token"];
    const cpanelHost = rows[0]["host"];
    const cpanelPort = rows[0]["port"];
    const domain = rows[0]["domain"];
    const { email, passwords } = req.body;
    const apiUrl = `https://${cpanelHost}:${cpanelPort}/execute/Email/add_pop?email=${email}&password=${passwords}&domain=${domain}`;
    const response = await axios.get(apiUrl, { headers: { Authorization: `cpanel ${cpanelUsername}:${cpanelToken}`, }, });
    return res.status(200).json({ data: response.data });

}

module.exports = { Insert };
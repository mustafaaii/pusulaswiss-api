const { default: axios } = require('axios');
const { getconnect } = require('../../../datebase');

const Delete = async (req, res) => {
    const id = 1;
    const connection = await getconnect();
    const [rows] = await connection.execute('SELECT * FROM mailapi WHERE id = ? ', [id]);

    const cpanelUsername = rows[0]["username"];
    const cpanelToken = rows[0]["token"];
    const cpanelHost = rows[0]["host"];
    const cpanelPort = rows[0]["port"];
    const domain = rows[0]["domain"];

    const { email } = req.body;
    let apiUrl = `https://${cpanelHost}:${cpanelPort}/execute/Email/delete_pop?email=${email}&domain=${domain}`;
    const response = await axios.get(apiUrl, {
        headers: {
            Authorization: `cpanel ${cpanelUsername}:${cpanelToken}`,
        },
    });
    return res.status(200).json(response.data);
}

module.exports = { Delete };
const { default: axios } = require('axios');
const { getconnect } = require('../../../datebase');

const Select = async (req, res) => {
    const id = 1;
    const connection = await getconnect();
    const [rows] = await connection.execute('SELECT * FROM mailapi WHERE id = ? ', [id]);
    const cpanelUsername = rows[0]["username"]; // cPanel kullanıcı adı
    const cpanelToken = rows[0]["token"]; // API Token
    const cpanelHost = rows[0]["host"]; // cPanel IP
    const cpanelPort = rows[0]["port"]; // API Port
    const domain = rows[0]["domain"]; // Alan adı
    const apiUrl = `https://${cpanelHost}:${cpanelPort}/cpsess/json-api/cpanel?cpanel_jsonapi_user=${cpanelUsername}&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Email&cpanel_jsonapi_func=listpopswithdisk&domain=${domain}&nearquotaonly=0&no_validate=0`;
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `cpanel ${cpanelUsername}:${cpanelToken}`,
            },
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(error.response?.status || 500).json({ error: error.message });
    }
};

module.exports = { Select };
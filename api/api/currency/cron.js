const axios = require('axios');
const { getconnect } = require('../../../datebase');

const currencies = [
    'EUR', 'GBP', 'USD', "TRY"
];

const CurrencyCron = async () => {
    const connection = await getconnect();

    try {
        const response = await axios.get('https://api.collectapi.com/economy/currencyToAll?int=10&base=CHF', {
            headers: {
                'content-type': 'application/json',
                'authorization': 'apikey 3MT2WHrRp6cAjvA7sUBxw1:73E7t0TkBchEbDSsoFKkdl',
            }
        });

        if (response.status !== 200) {
            throw new Error('API isteği başarısız oldu');
        }

        // API yanıtını kontrol et
        const data = response.data;
        const exchangeRates = data.result.data;
        for (const currency of exchangeRates) {
            const { code, name, rate, calculated, calculatedstr } = currency;

            // Belirtilen para birimlerinin var olup olmadığını kontrol et
            if (currencies.includes(code)) {
                const query = `
                    INSERT INTO currency (code, name, rate, calculatedstr, calculated, date) 
                    VALUES (?, ?, ?, ?, ?, NOW())  
                    ON DUPLICATE KEY UPDATE 
                        code = VALUES(code), 
                        name = VALUES(name),
                        rate = VALUES(rate),
                        calculated = VALUES(calculated),
                        calculatedstr = VALUES(calculatedstr),
                        date = NOW();
                `;

                // Veritabanına veri ekle
                await connection.execute(query, [code, name, rate, calculatedstr, calculated]);

                console.log(`${name} (${code}) döviz verisi başarıyla güncellendi. Değer: ${rate}`);
            }
        }

    } catch (error) {
        console.error('Döviz verisi alınırken hata oluştu:', error.message);
    }
};

module.exports = { CurrencyCron };
const data = {
    base: 'CHF',
    lastupdate: 'Mar 20, 2025 17:26 UTC',
    data: [
        {
            code: 'ARS',
            name: 'Argentine Peso',
            rate: 1211.927137,
            calculatedstr: '12119.27',
            calculated: 12119.27
        },
        {
            code: 'AUD',
            name: 'Australian Dollar',
            rate: 1.80169,
            calculatedstr: '18.02',
            calculated: 18.02
        },
        {
            code: 'BHD',
            name: 'Bahraini Dinar',
            rate: 0.42624,
            calculatedstr: '4.26',
            calculated: 4.26
        },
        {
            code: 'BWP',
            name: 'Botswana Pula',
            rate: 15.4278,
            calculatedstr: '154.28',
            calculated: 154.28
        },
        {
            code: 'BRL',
            name: 'Brazilian Real',
            rate: 6.421979,
            calculatedstr: '64.22',
            calculated: 64.22
        },
        {
            code: 'BND',
            name: 'Bruneian Dollar',
            rate: 1.514238,
            calculatedstr: '15.14',
            calculated: 15.14
        },
        {
            code: 'BGN',
            name: 'Bulgarian Lev',
            rate: 2.04465,
            calculatedstr: '20.45',
            calculated: 20.45
        },
        {
            code: 'CAD',
            name: 'Canadian Dollar',
            rate: 1.624552,
            calculatedstr: '16.25',
            calculated: 16.25
        },
        {
            code: 'CLP',
            name: 'Chilean Peso',
            rate: 1051.45898,
            calculatedstr: '10514.59',
            calculated: 10514.59
        },
        {
            code: 'CNY',
            name: 'Chinese Yuan Renminbi',
            rate: 8.216199,
            calculatedstr: '82.16',
            calculated: 82.16
        },
        {
            code: 'COP',
            name: 'Colombian Peso',
            rate: 4742.970918,
            calculatedstr: '47429.71',
            calculated: 47429.71
        },
        {
            code: 'CZK',
            name: 'Czech Koruna',
            rate: 26.153798,
            calculatedstr: '261.54',
            calculated: 261.54
        },
        {
            code: 'DKK',
            name: 'Danish Krone',
            rate: 7.798075,
            calculatedstr: '77.98',
            calculated: 77.98
        },
        {
            code: 'EUR',
            name: 'Euro',
            rate: 1.045413,
            calculatedstr: '10.45',
            calculated: 10.45
        },
        {
            code: 'HKD',
            name: 'Hong Kong Dollar',
            rate: 8.811087,
            calculatedstr: '88.11',
            calculated: 88.11
        },
        {
            code: 'HUF',
            name: 'Hungarian Forint',
            rate: 416.916971,
            calculatedstr: '4169.17',
            calculated: 4169.17
        },
        {
            code: 'ISK',
            name: 'Icelandic Krona',
            rate: 150.861353,
            calculatedstr: '1508.61',
            calculated: 1508.61
        },
        {
            code: 'INR',
            name: 'Indian Rupee',
            rate: 97.902228,
            calculatedstr: '979.02',
            calculated: 979.02
        },
        {
            code: 'IDR',
            name: 'Indonesian Rupiah',
            rate: 18700.107839,
            calculatedstr: '187001.08',
            calculated: 187001.08
        },
        {
            code: 'IRR',
            name: 'Iranian Rial',
            rate: 47713.997488,
            calculatedstr: '477139.97',
            calculated: 477139.97
        },
        {
            code: 'ILS',
            name: 'Israeli Shekel',
            rate: 4.172937,
            calculatedstr: '41.73',
            calculated: 41.73
        },
        {
            code: 'JPY',
            name: 'Japanese Yen',
            rate: 168.740005,
            calculatedstr: '1687.40',
            calculated: 1687.4
        },
        {
            code: 'KZT',
            name: 'Kazakhstani Tenge',
            rate: 570.481731,
            calculatedstr: '5704.82',
            calculated: 5704.82
        },
        {
            code: 'KRW',
            name: 'South Korean Won',
            rate: 1664.430115,
            calculatedstr: '16644.30',
            calculated: 16644.3
        },
        {
            code: 'KWD',
            name: 'Kuwaiti Dinar',
            rate: 0.349292,
            calculatedstr: '3.49',
            calculated: 3.49
        },
        {
            code: 'LYD',
            name: 'Libyan Dinar',
            rate: 5.453503,
            calculatedstr: '54.54',
            calculated: 54.54
        },
        {
            code: 'MYR',
            name: 'Malaysian Ringgit',
            rate: 5.017599,
            calculatedstr: '50.18',
            calculated: 50.18
        },
        {
            code: 'MUR',
            name: 'Mauritian Rupee',
            rate: 51.034176,
            calculatedstr: '510.34',
            calculated: 510.34
        },
        {
            code: 'MXN',
            name: 'Mexican Peso',
            rate: 22.826099,
            calculatedstr: '228.26',
            calculated: 228.26
        },
        {
            code: 'NPR',
            name: 'Nepalese Rupee',
            rate: 156.716992,
            calculatedstr: '1567.17',
            calculated: 1567.17
        },
        {
            code: 'NZD',
            name: 'New Zealand Dollar',
            rate: 1.973789,
            calculatedstr: '19.74',
            calculated: 19.74
        },
        {
            code: 'NOK',
            name: 'Norwegian Krone',
            rate: 11.979519,
            calculatedstr: '119.80',
            calculated: 119.8
        },
        {
            code: 'OMR',
            name: 'Omani Rial',
            rate: 0.436308,
            calculatedstr: '4.36',
            calculated: 4.36
        },
        {
            code: 'PKR',
            name: 'Pakistani Rupee',
            rate: 317.670451,
            calculatedstr: '3176.70',
            calculated: 3176.7
        },
        {
            code: 'PHP',
            name: 'Philippine Peso',
            rate: 64.892722,
            calculatedstr: '648.93',
            calculated: 648.93
        },
        {
            code: 'PLN',
            name: 'Polish Zloty',
            rate: 4.383208,
            calculatedstr: '43.83',
            calculated: 43.83
        },
        {
            code: 'QAR',
            name: 'Qatari Riyal',
            rate: 4.126369,
            calculatedstr: '41.26',
            calculated: 41.26
        },
        {
            code: 'RON',
            name: 'Romanian New Leu',
            rate: 5.203098,
            calculatedstr: '52.03',
            calculated: 52.03
        },
        {
            code: 'RUB',
            name: 'Russian Ruble',
            rate: 96.27138,
            calculatedstr: '962.71',
            calculated: 962.71
        },
        {
            code: 'SAR',
            name: 'Saudi Arabian Riyal',
            rate: 4.251066,
            calculatedstr: '42.51',
            calculated: 42.51
        },
        {
            code: 'SGD',
            name: 'Singapore Dollar',
            rate: 1.514238,
            calculatedstr: '15.14',
            calculated: 15.14
        },
        {
            code: 'ZAR',
            name: 'South African Rand',
            rate: 20.593234,
            calculatedstr: '205.93',
            calculated: 205.93
        },
        {
            code: 'LKR',
            name: 'Sri Lankan Rupee',
            rate: 335.933813,
            calculatedstr: '3359.34',
            calculated: 3359.34
        },
        {
            code: 'SEK',
            name: 'Swedish Krona',
            rate: 11.502148,
            calculatedstr: '115.02',
            calculated: 115.02
        },
        {
            code: 'TWD',
            name: 'Taiwan New Dollar',
            rate: 37.427106,
            calculatedstr: '374.27',
            calculated: 374.27
        },
        {
            code: 'THB',
            name: 'Thai Baht',
            rate: 38.295642,
            calculatedstr: '382.96',
            calculated: 382.96
        },
        {
            code: 'TTD',
            name: 'Trinidadian Dollar',
            rate: 7.700358,
            calculatedstr: '77.00',
            calculated: 77
        },
        {
            code: 'TRY',
            name: 'Turkish Lira',
            rate: 43.040707,
            calculatedstr: '430.41',
            calculated: 430.41
        },
        {
            code: 'AED',
            name: 'Emirati Dirham',
            rate: 4.163211,
            calculatedstr: '41.63',
            calculated: 41.63
        },
        {
            code: 'GBP',
            name: 'British Pound',
            rate: 0.874678,
            calculatedstr: '8.75',
            calculated: 8.75
        },
        {
            code: 'USD',
            name: 'US Dollar',
            rate: 1.133618,
            calculatedstr: '11.34',
            calculated: 11.34
        }
    ]
}
const axios = require('axios');
const { getconnect } = require('../../../datebase');

const cities = [
    'zurich', 'geneva', 'basel', 'bern', 'lucerne', 'lausanne', 'gallen', 'thun', 'winterthur', 'lucerne'
];

const Cron = async () => {
    const connection = await getconnect();
    for (const city of cities) {
        try {
            const response = await axios.get(`https://api.collectapi.com/weather/getWeather?data.lang=en&data.city=${city}`, {
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'apikey 3MT2WHrRp6cAjvA7sUBxw1:73E7t0TkBchEbDSsoFKkdl',
                }
            });

            if (response.status !== 200) {
                throw new Error('API isteği başarısız oldu');
            }

            const data = response.data;
            const weatherData = data.result[0];

            const {
                description,
                degree,
                humidity,
                max,
                min,
                night,
                status,
                date
            } = weatherData;

            const formattedDate = date.split('.').reverse().join('-');

            const query = `
                INSERT INTO weather (city, description, degree, humidity, max, min, night, status, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    description = VALUES(description), 
                    degree = VALUES(degree),
                    humidity = VALUES(humidity),
                    max = VALUES(max),
                    min = VALUES(min),
                    night = VALUES(night),
                    status = VALUES(status),
                    date = VALUES(date);
            `;

            // Veritabanına veri ekle
            await connection.execute(query, [city, description, degree, humidity, max, min, night, status, formattedDate]);

            console.log(`${city} için hava durumu başarıyla güncellendi.`);
        } catch (error) {
            console.error(`${city} için hava durumu verisi alınırken hata oluştu:`, error.message);
        }
    }
};

module.exports = { Cron };

const { getconnect } = require('../../datebase');


const Stats = async (req, res) => {
    const connection = await getconnect();
    const [threadsConnected] = await connection.execute(`SHOW STATUS LIKE "Threads_connected"`);
    const [questions] = await connection.execute('SHOW STATUS LIKE "Questions"');
    const [bytesReceived] = await connection.execute('SHOW STATUS LIKE "Bytes_received"');
    const [bytesSent] = await connection.execute('SHOW STATUS LIKE "Bytes_sent"');
    const [pool] = await connection.execute('SHOW STATUS LIKE "Innodb_buffer_pool_reads"');


    await connection.end();
    res.status(200).json({
        status: true, data: {
            threadsConnected,
            questions,
            bytesReceived,
            bytesSent,
            pool
        }
    });
};

module.exports = { Stats };

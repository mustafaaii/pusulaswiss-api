const WebSocket = require('ws');
const si = require('systeminformation');
const os = require('os');

const Stats = async (server) => {
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        const sendStats = async () => {
            try {
                const cpu = await si.currentLoad();
                const mem = await si.mem();
                const osInfo = await si.osInfo();
                const disk = await si.fsSize();

                const stats = {
                    cpuLoad: cpu.currentLoad,
                    totalMem: mem.total,
                    usedMem: mem.active,
                    freeMem: mem.available,
                    uptime: (os.uptime() / 60),
                    platform: osInfo.platform,
                    distro: osInfo.distro,
                    diskUsage: disk.map(d => ({
                        mount: d.mount,
                        size: (d.size / 1024 / 1024 / 1024).toFixed(2),
                        used: (d.used / 1024 / 1024 / 1024).toFixed(2),
                        use: d.use
                    }))
                };

                ws.send(JSON.stringify(stats));  // Veriyi gönderiyoruz
            } catch (error) {
                console.error('Statlar alınırken bir hata oluştu:', error);
            }
        };

        const interval = setInterval(sendStats, 20000); // 5 saniyede bir

        ws.on('close', () => {
            clearInterval(interval);
            console.log('İstemci bağlantısı kapandı');
        });
    });

    wss.on('error', (err) => {
        console.error('WebSocket hatası:', err);
    });
};

module.exports = Stats;

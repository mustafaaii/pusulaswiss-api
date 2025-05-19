const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const sharp = require('sharp');

const Manager = async (req, res) => {
    const uploadRoot = path.join(__dirname, '..', '../upload');
    const limit = parseInt(req.body.limit) || 10;
    const page = parseInt(req.body.page) || 1;
    const order = (req.body.order || 'desc').toLowerCase();
    const foldersToCheck = req.body.folders || [];
    const minWidth = req.body.width || 0;
    const maxWidth = req.body.maxWidth || Infinity;
    const minHeight = req.body.height || 0;
    const maxHeight = req.body.maxHeight || Infinity;

    try {
        if (!fs.existsSync(uploadRoot)) {
            return res.status(200).json({ error: 'Upload klasörü bulunamadı' });
        }

        const folders = foldersToCheck.length ? foldersToCheck : fs.readdirSync(uploadRoot, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const result = {};

        for (const folder of folders) {
            const folderPath = path.join(uploadRoot, folder);
            const files = fs.readdirSync(folderPath);

            // Filtrelenmiş dosyaları topla
            const filteredFiles = await Promise.all(files.map(async (file) => {
                const fullPath = path.join(folderPath, file);
                const stats = fs.statSync(fullPath);
                const mimeType = mime.lookup(file) || 'application/octet-stream';

                let dimensions = null;
                let sizeText = null;

                if (mimeType.startsWith('image/')) {
                    try {
                        const metadata = await sharp(fullPath).metadata();
                        dimensions = {
                            width: metadata.width,
                            height: metadata.height
                        };
                        sizeText = `${metadata.width}x${metadata.height}`;

                        // Filtre uygunsa döndür
                        if (
                            dimensions.width >= minWidth &&
                            dimensions.width <= maxWidth &&
                            dimensions.height >= minHeight &&
                            dimensions.height <= maxHeight
                        ) {
                            return {
                                name: file,
                                path: fullPath,
                                stats,
                                mimeType,
                                dimensions,
                                sizeText
                            };
                        } else {
                            return null;
                        }
                    } catch (err) {
                        console.warn(`Boyut alınamadı: ${file} => ${err.message}`);
                        return null;
                    }
                }

                // Resim olmayan dosyalar her zaman geçerli
                return {
                    name: file,
                    path: fullPath,
                    stats,
                    mimeType,
                    dimensions,
                    sizeText
                };
            }));

            // Geçerli (null olmayan) dosyaları filtrele
            const validFiles = filteredFiles.filter(file => file !== null);

            // Tarihe göre sırala
            validFiles.sort((a, b) => {
                return order === 'asc'
                    ? a.stats.birthtimeMs - b.stats.birthtimeMs
                    : b.stats.birthtimeMs - a.stats.birthtimeMs;
            });

            // Sayfalama
            const start = (page - 1) * limit;
            const paginated = validFiles.slice(start, start + limit);

            const fileData = paginated.map((item, index) => ({
                id: start + index + 1,
                name: item.name,
                url: `/upload/${folder}/${item.name}`,
                type: item.mimeType,
                size: item.stats.size,
                sizeText: item.sizeText || `${(item.stats.size / (1024 * 1024)).toFixed(2)} MB`,
                createdDate: item.stats.birthtime.toISOString().split("T")[0],
                createdTime: item.stats.birthtime.toISOString().split("T")[1].split(":")[0] + ":" + item.stats.birthtime.toISOString().split("T")[1].split(":")[1],
                dimensions: item.dimensions
            }));

            result[folder] = fileData;
            result[`${folder}_meta`] = {
                totalFiles: validFiles.length,
                totalPages: Math.ceil(validFiles.length / limit),
                currentPage: page,
                limit: limit
            };
        }

        res.status(200).json(result);

    } catch (error) {
        console.error('Dosya yönetim hatası:', error);
        res.status(500).json({ error: 'Dosyalar alınırken bir hata oluştu' });
    }
};

module.exports = { Manager };

const fs = require('fs');
const path = require('path');

const Delete = async (req, res) => {
    const { path: fileUrl } = req.body;

    const uploadRoot = path.join(__dirname, '..', '../upload');
    const relativePath = fileUrl.replace('/upload/', '');
    const fullPath = path.join(uploadRoot, relativePath);
    if (!fullPath.startsWith(uploadRoot)) {
        return res.status(200).json({ error: 'Geçersiz dosya yolu' });
    }
    try {
        if (!fs.existsSync(fullPath)) {
            return res.status(200).json({ error: 'Dosya bulunamadı' });
        }
        fs.unlinkSync(fullPath);
        res.status(200).json({ success: true, message: 'Dosya başarıyla silindi' });
    } catch (error) {
        console.error('Silme hatası:', error);
        res.status(200).json({ error: 'Dosya silinirken bir hata oluştu' });
    }
};

module.exports = { Delete };
